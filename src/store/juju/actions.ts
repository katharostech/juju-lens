import { Dialog, Notify } from 'quasar';
import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, Controller, Model } from './state';
import { mutationTypes } from './mutations';
import Jujulib from '@canonical/jujulib';
import allModelWatcherFacade from '@canonical/jujulib/api/facades/all-model-watcher-v2.js';
import controllerFacade from '@canonical/jujulib/api/facades/controller-v5.js';
import applicationFacade from '@canonical/jujulib/api/facades/application-v8.js';
import { getItemId } from './state/utils';

export const actionTypes = {
  // Controllers
  loadControllers: 'loadControllers',
  setCurrentController: 'setCurrentController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  establishControllerConn: 'establishControllerConn',
  commitControllerDelta: 'commitControllerDelta',
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
      port: state.controllers[controller].port,
      insecure: state.controllers[controller].insecure
    };
  }

  const data: JujuStateInterface = {
    currentController: state.currentController,
    controllers
  };

  window.appLocalStorage.setItem(JUJU_LOCAL_STORE_NAME, data);
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
    const localStore: JujuStateInterface = window.appLocalStorage.getItem(
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
    const options = {
      debug: false,
      facades: facades,
      wsclass: window.__TAURI__
        ? controller.insecure
          ? window.TauriWebSocketInsecure
          : window.TauriWebSocket
        : window.WebSocket
    };
    Jujulib.connectAndLogin(
      `wss://${controller.host}:${controller.port}/api`,
      {
        user: `user-${controller.username}`,
        password: controller.password
      },
      options,
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
        const handle = controllerConn.watch((err: any, result: any) => {
          if (err) {
            console.error(err);
            return;
          }

          // Update controller data from change feed
          for (const delta of result.deltas) {
            ctx.dispatch(actionTypes.commitControllerDelta, {
              name,
              controllerName: name,
              data: delta
            });
          }
        });

        // Update the controller with the connection and listen handle
        controller.conn = controllerConn;
        controller.controllerWatchHandle = handle;
        ctx.commit(mutationTypes.updateController, { name, controller });
      }
    );
  },

  /**
   * Commit's a delta from the controller all model watcher. There is a corresponding mutation that handles most of the work, but this function must be an action because for models it must open up a websocket connection for the model.
   */
  [actionTypes.commitControllerDelta](
    ctx,
    {
      name,
      controllerName,
      data: [dataType, mutationType, data]
    }: {
      name: string;
      controllerName: string;
      data: [
        'model' | 'application' | 'machine' | 'unit' | 'charm',
        'change' | 'remove',
        any
      ];
    }
  ) {
    // If this is a model
    if (dataType == 'model') {
      const model = data as Model;
      const modelId = getItemId(controllerName, model['model-uuid']);
      const controller = ctx.state.controllers[controllerName];

      // If the model doesn't exist yet
      if (
        !controller.models[modelId] ||
        (controller.models[modelId] && !controller.models[modelId].conn)
      ) {
        // Create a Juju API connection
        const facades = [applicationFacade];
        const options = {
          debug: false,
          facades: facades,
          wsclass: window.__TAURI__
            ? window.TauriWebSocketInsecure
            : window.WebSocket
        };
        Jujulib.connectAndLogin(
          `wss://${controller.host}:${controller.port}/model/${model['model-uuid']}/api`,
          {
            user: `user-${controller.username}`,
            password: controller.password
          },
          options,
          (err: any, result: any) => {
            if (err) {
              console.error(err);

              // Try again in a second
              setTimeout(() => {
                ctx.dispatch(actionTypes.commitControllerDelta, {
                  name,
                  controllerName,
                  data: [dataType, mutationType, data]
                });
              }, 1000);
              return;
            }

            // Add the connection to the model data
            model.conn = result;

            // Apply the mutation to the state
            ctx.commit(mutationTypes.commitControllerDelta, {
              name,
              data: [dataType, mutationType, data]
            });
          }
        );
      }
    }

    // Apply the mutation to the state
    ctx.commit(mutationTypes.commitControllerDelta, {
      name,
      data: [dataType, mutationType, data]
    });
  },

  /**
   * Delete a controller
   */
  [actionTypes.deleteController](ctx, name: string) {
    const controller = ctx.state.controllers[name];
    // Close controller connection if it is open
    if (controller && controller.conn && controller.controllerWatchHandle) {
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
