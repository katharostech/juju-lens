import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, Model, Unit, Application } from './state';

// /** Returns the models that in the selected current controller */
// function controllerModels(state: JujuStateInterface): Model[] {
//   return state.models.filter(
//     model =>
//       state.currentController == 'All' ||
//       model.controllerId == state.currentController.id
//   );
// }

// /** Returns the applications that in the selected current controller */
// function controllerApplications(state: JujuStateInterface): Application[] {
//   const modelIds = controllerModels(state).map(model => model.id);

//   return state.applications.filter(app => modelIds.includes(app.modelId));
// }

// /** Returns the units that in the selected current controller */
// function controllerUnits(state: JujuStateInterface): Unit[] {
//   const applicationIds = controllerApplications(state).map(app => app.id);

//   return state.units.filter(unit => applicationIds.includes(unit.applicationId));
// }

const getters: GetterTree<JujuStateInterface, StoreInterface> = {
  // // The models for the current controller
  // controllerModels(state): Model[] {
  //   return controllerModels(state);
  // },

  // // The applications for the current controller
  // controllerApplications(state): Application[] {
  //   return controllerApplications(state);
  // },

  // // Gets the units in the current controller
  // controllerUnits(state): Unit[] {
  //   return controllerUnits(state);
  // }
};

export default getters;
