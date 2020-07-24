import { MutationTree } from 'vuex';
import Vue from 'vue';

import {
  JujuStateInterface,
  Controller,
  Charm,
  Unit,
  Application,
  Model,
  Machine
} from './state';
import { getItemId } from './state/utils';

export const mutationTypes = {
  // Controller
  setCurrentController: 'setCurrentController',
  setControllers: 'setControllers',
  updateController: 'updateController',
  deleteController: 'deleteController',
  commitControllerDelta: 'commitControllerDelta',
  // Clear state
  clearState: 'clearState'
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
  [mutationTypes.commitControllerDelta](
    state,
    {
      name,
      data: [dataType, mutationType, data]
    }: {
      name: string;
      data: [
        'model' | 'application' | 'machine' | 'unit' | 'charm',
        'change' | 'remove',
        any
      ];
    }
  ) {
    if (dataType == 'model') {
      // Model resource delta
      const model: Model = data;
      const id = getItemId(name, model['model-uuid']);

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].models, id, {
          ...model,
          lensId: id
        });
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].models, id);
      }
    } else if (dataType == 'application') {
      // Application resource delta
      const app: Application = data;
      const id = getItemId(name, app['model-uuid'], app.name);

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].applications, id, {
          ...app,
          lensId: id
        });
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].applications, id);
      }
    } else if (dataType == 'unit') {
      // Unit resource delta
      const unit: Unit = data;
      const id = getItemId(name, unit['model-uuid'], unit.name);

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].units, id, {
          ...unit,
          lensId: id
        });
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].units, id);
      }
    } else if (dataType == 'machine') {
      // Machine resource delta
      const machine: Machine = data;
      const id = getItemId(name, machine['model-uuid'], machine.id);

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].machines, id, {
          ...machine,
          lensId: id
        });
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].machines, id);
      }
    } else if (dataType == 'charm') {
      // Charm resource delta
      const charm: Charm = data;
      const id = getItemId(name, charm['model-uuid'], charm['charm-url']);

      if (mutationType == 'change') {
        Vue.set(state.controllers[name].charms, id, {
          ...charm,
          lensId: id
        });
      } else if (mutationType == 'remove') {
        Vue.delete(state.controllers[name].charms, id);
      }
    } else {
      // Unidentified resource delta
      console.warn(
        `Unidentified resource type from Juju controller changefeed: ${dataType}`
      );
    }
  },

  /** Reset state ( usually to logout ) */
  [mutationTypes.clearState](state) {
    state.controllers = {};
    state.currentController = 'All';
  }
};

export default mutation;
