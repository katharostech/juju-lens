import { Dialog, Notify } from 'quasar';
import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, Controller } from './state';
import { mutationTypes } from './mutations';
import { LocalStorage } from 'quasar';
import Jujulib from '@canonical/jujulib';
import allModelWatcherFacade from '@canonical/jujulib/api/facades/all-model-watcher-v2.js';
import controllerFacade from '@canonical/jujulib/api/facades/controller-v5.js';

export const actionTypes = {
  // Controllers
  loadControllers: 'loadControllers',
  setCurrentController: 'setCurrentController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  establishControllerConn: 'establishControllerConn',
  // App
  logout: 'logout'
};

// TODO: Not sure if this is a good place for this export, but it's better than nothing
export const JUJU_LOCAL_STORE_NAME = 'jujuState';

function persistControllerState(state: JujuStateInterface) {
  const controllers: { [key: string]: Controller } = {};
  // Get all the controllers but leave out the specific model, unit, etc. data
  for (const controller in state.controllers) {
    controllers[controller] = {
      applications: {},
      charms: {},
      machines: {},
      models: {},
      units: {},
      username: state.controllers[controller].username,
      password: state.controllers[controller].password,
      host: state.controllers[controller].host,
      port: state.controllers[controller].port
    };
  }

  const data: JujuStateInterface = {
    currentController: state.currentController,
    controllers
  };

  LocalStorage.set(JUJU_LOCAL_STORE_NAME, data);
}

const actions: ActionTree<JujuStateInterface, StoreInterface> = {
  //
  // Controllers
  //

  /**
   * Set the current controller
   */
  [actionTypes.setCurrentController](ctx, controller: 'All' | string) {
    // Update state
    ctx.commit(mutationTypes.setCurrentController, controller);

    // Persist state
    persistControllerState(ctx.state);
  },

  /**
   * Load controller data
   */
  [actionTypes.loadControllers](ctx) {
    const localStore: JujuStateInterface = LocalStorage.getItem(
      JUJU_LOCAL_STORE_NAME
    ) as JujuStateInterface;

    if (localStore) {
      // Load the current controller
      ctx.commit(
        mutationTypes.setCurrentController,
        localStore.currentController
      );

      for (const controller in localStore.controllers) {
        ctx.dispatch(actionTypes.updateController, {
          name: controller,
          controller: localStore.controllers[controller]
        });
      }
    }
  },

  /**
   * update a controller, also used to add a controller
   */
  [actionTypes.updateController](
    ctx,
    { name, controller }: { name: string; controller: Controller }
  ) {
    const prevController = ctx.state.controllers[name];

    // TODO: only do this if the URL/username/password has changed
    // If this controller has an open connection
    if (prevController && prevController.controllerWatchHandle) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prevController.controllerWatchHandle.stop((err: any) => {
        if (err) {
          console.error(err);
        }
      });
      // TODO: Determine whether or not some sort of logout is required
    }

    // Commit the controller update to the state
    ctx.commit(mutationTypes.updateController, { name, controller });

    // Persist state
    persistControllerState(ctx.state);

    // If the controller connection has not been established
    if (!controller.conn && !controller.controllerWatchHandle) {
      // Establish controller connection
      ctx.dispatch(actionTypes.establishControllerConn, name);
    }
  },

  /**
   * Establish Juju controller connection and start listening for changes to the
   * controller models.
   */
  [actionTypes.establishControllerConn](ctx, name: string) {
    const controller = ctx.state.controllers[name];
    // If the controller doesn't exist, just ignore the request
    if (!controller) {
      return;
    }

    const facades = [allModelWatcherFacade, controllerFacade];
    const options = { debug: false, facades: facades, wsclass: WebSocket };
    Jujulib.connectAndLogin(
      `wss://${controller.host}:${controller.port}/api`,
      {
        user:
          // There's a nuance with libjuju where you have to put the username as `user-admin`
          // to log in as `admin`.
          controller.username == 'admin' ? 'user-admin' : controller.username,
        password: controller.password
      },
      options,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any, result: any) => {
        if (err) {
          console.error(err);

          // Try again in a second
          setTimeout(() => {
            ctx.dispatch(actionTypes.establishControllerConn, name);
          }, 1000);
          return;
        }
        const controllerConn = result.conn.facades.controller;

        // Subscribe to the change-feed
        const handle = controllerConn.watch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err: any, result: any) => {
            if (err) {
              console.log(err);
              return;
            }

            // Update controller data from change feed
            for (const delta of result.deltas) {
              ctx.commit(mutationTypes.updateControllerData, {
                name,
                data: delta
              });
            }
          }
        );

        // Update the controller with the connection and listen handle
        controller.conn = controllerConn;
        controller.controllerWatchHandle = handle;
        ctx.commit(mutationTypes.updateController, { name, controller });
      }
    );
  },

  /**
   * Delete a controller
   */
  [actionTypes.deleteController](ctx, name: string) {
    const controller = ctx.state.controllers[name];
    console.log;
    // Close controller connection if it is open
    if (controller && controller.conn && controller.controllerWatchHandle) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controller.controllerWatchHandle.stop((err: any) => {
        if (err) {
          console.error(err);
        }
      });

      // TODO: Find out if a logout is necessary:
      // https://github.com/juju/js-libjuju/blob/124ea0969ff9702b07eb2ea79f5b1b471e741b07/examples/watch-all-models.js#L41
    }

    ctx.commit(mutationTypes.deleteController, name);

    // Persist state
    persistControllerState(ctx.state);
  },

  /** Logout of all controllers and clear the persited Juju state */
  [actionTypes.logout](ctx) {
    Dialog.create({
      title: 'Logout',
      message:
        'Are you sure you want to logout of all controllers? You will have to add them manually again to re-connect.',
      cancel: true,
      ok: {
        color: 'negative',
        label: 'Logout'
      }
    }).onOk(() => {
      ctx.commit(mutationTypes.clearState);
      persistControllerState(ctx.state);

      Notify.create({
        type: 'positive',
        message: 'Succesfully logged you out',
        icon: 'logout',
        position: 'bottom-right',
        timeout: 2000
      });
    });
  }
};

export default actions;
