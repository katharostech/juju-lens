import { MutationTree } from 'vuex';
import {
  JujuStateInterface,
  Controller,
  Charm,
  Unit,
  Application,
  Model,
  Machine
} from './state';
import Vue from 'vue';

export const mutationTypes = {
  // Controller
  setCurrentController: 'setCurrentController',
  setControllers: 'setControllers',
  updateController: 'updateController',
  deleteController: 'deleteController',
  updateControllerData: 'updateControllerData'
};

const mutation: MutationTree<JujuStateInterface> = {
  //
  // Controller
  //

  /** Set the current controller */
  [mutationTypes.setCurrentController](state, controller: 'All' | string) {
    state.currentController = controller;
  },

  /** Set controllers */
  [mutationTypes.setControllers](
    state,
    controllers: { [key: string]: Controller }
  ) {
    state.controllers = controllers;
  },

  /** Update controller: also used to add a new controller */
  [mutationTypes.updateController](
    state,
    { name, controller }: { name: string; controller: Controller }
  ) {
    Vue.set(state.controllers, name, controller);
  },

  /** Delete controller */
  [mutationTypes.deleteController](state, name: string) {
    Vue.delete(state.controllers, name);

    // If the deleted controller was the current controller, set the current controller
    // to 'All'
    if (state.currentController == name) {
      state.currentController = 'All';
    }
  },

  /**
   * Update's the controller's `data`, i.e. units, models, statuses, etc as given
   * by the output of the `AllModelWatcher` Facade's `next()` function:
   * https://github.com/juju/js-libjuju/blob/master/api/doc/all-model-watcher-v2.md
   */
  [mutationTypes.updateControllerData](
    state,
    {
      name,
      data: [dataType, mutationType, data]
    }: {
      name: string;
      data: [
        'model' | 'application' | 'machine' | 'unit' | 'charm',
        'change' | 'remove',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      ];
    }
  ) {
    if (dataType == 'model') {
      const model: Model = data;

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].models, model.name, model);
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].models, model.name);
      }
    } else if (dataType == 'application') {
      const app: Application = data;

      if (mutationType == 'change') {
        Vue.set(
          state.controllers[name].applications,
          app['model-uuid'] + '-' + app.name,
          app
        );
      } else if (mutationType == 'remove') {
        Vue.delete(
          state.controllers[name].applications,
          app['model-uuid'] + '-' + app.name
        );
      }
    } else if (dataType == 'unit') {
      const unit: Unit = data;

      if (mutationType == 'change') {
        Vue.set(
          state.controllers[name].units,
          unit['model-uuid'] + '-' + unit.name,
          unit
        );
      } else if (mutationType == 'remove') {
        Vue.delete(
          state.controllers[name].units,
          unit['model-uuid'] + '-' + unit.name
        );
      }
    } else if (dataType == 'machine') {
      const machine: Machine = data;

      if (mutationType == 'change') {
        Vue.set(
          state.controllers[name].machines,
          machine['model-uuid'] + '-' + machine['id'],
          machine
        );
      } else if (mutationType == 'remove') {
        Vue.delete(
          state.controllers[name].machines,
          machine['model-uuid'] + '-' + machine['id']
        );
      }
    } else if (dataType == 'charm') {
      const charm: Charm = data;

      if (mutationType == 'change') {
        Vue.set(
          state.controllers[name].charms,
          charm['charm-url'] + '-' + charm['charm-version'],
          charm
        );
      } else if (mutationType == 'remove') {
        Vue.delete(
          state.controllers[name].charms,
          charm['charm-url'] + '-' + charm['charm-version']
        );
      } else {
        console.warn(
          `Unidentified resource type from Juju controller changefeed: ${dataType}`
        );
      }
    }
  }
};

export default mutation;
