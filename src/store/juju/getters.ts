/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, ControllerData, Controller } from './state';
import { FilledModel, fillModel } from './state/utils';

export const getterTypes = {
  currentControllerData: 'currentControllerData',
  currentControllerModelsFilled: 'currentControllerModelsFilled'
};

function combineDataFromControllers(
  dataType: string,
  controllers: { [key: string]: Controller }
): { [key: string]: any } {
  const newData: { [key: string]: unknown } = {};

  for (const ctrlrName in controllers) {
    const ctrlr = controllers[ctrlrName];

    for (const dataId in (ctrlr as any)[dataType]) {
      const data = (ctrlr as any)[dataType][dataId];

      newData[dataId] = data;
    }
  }

  return newData;
}

function getCurrentControllerData(state: JujuStateInterface): ControllerData {
  if (state.currentController != 'All') {
    return state.controllers[state.currentController];
  } else {
    return {
      models: combineDataFromControllers('models', state.controllers),
      units: combineDataFromControllers('units', state.controllers),
      applications: combineDataFromControllers(
        'applications',
        state.controllers
      ),
      charms: combineDataFromControllers('charms', state.controllers),
      machines: combineDataFromControllers('machines', state.controllers)
    };
  }
}

const getters: GetterTree<JujuStateInterface, StoreInterface> = {
  /**
   * Gets the data for the current controller, combining the data for all controllers if
   * the current controller is 'All'.
   */
  [getterTypes.currentControllerData](state): ControllerData {
    return getCurrentControllerData(state);
  },

  /**
   * Get's the list of filled models for the current controller
   */
  [getterTypes.currentControllerModelsFilled](state): FilledModel[] {
    const currentCtrlrData = getCurrentControllerData(state);
    const filledModels: FilledModel[] = [];

    for (const modelId in currentCtrlrData.models) {
      filledModels.push(fillModel(currentCtrlrData, modelId));
    }

    return filledModels;
  }
};

export default getters;
