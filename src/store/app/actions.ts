import Vue from 'vue';
import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import {
  AppStateInterface,
  FloatingUnitWindow,
  FloatingWindowKind,
  FloatingWindowKindString
} from './state';
import { Unit, Application } from 'store/juju/state';

import { mutationTypes } from './mutations';

import { uid } from 'quasar';

export const actionTypes = {
  addFloatingWindow: 'addFloatingWindow',
  removeFloatingUnitWindow: 'removeFloatingUnitWindow'
};

const actions: ActionTree<AppStateInterface, StoreInterface> = {
  /** Add Floating window */
  [actionTypes.addFloatingWindow](
    ctx,
    {
      unit,
      app,
      kind
    }: { unit: Unit; app: Application; kind: FloatingWindowKind }
  ): string {
    const id = uid();
    const window: FloatingUnitWindow = {
      id,
      unit,
      app,
      visible: false,
      maximized: false,
      zIndex: 0,
      kind: FloatingWindowKind[kind] as FloatingWindowKindString
    };

    // First create the window
    ctx.commit(mutationTypes.addFloatingUnitWindow, window);

    // Then show it separately to add the nice animation effect
    Vue.nextTick(() => {
      ctx.commit(mutationTypes.toggleFloatingUnitWindowVisible, window.id);
    });

    return id;
  },

  /** Remove Floating Window */
  [actionTypes.removeFloatingUnitWindow](ctx, id: string): void {
    // Hide the window first
    ctx.commit(mutationTypes.hideFloatingWindow, id);

    // Then remove it after next tick to make sure the user sees the leave
    // animation.
    Vue.nextTick(() => {
      // TODO: be smarter than just waiting here for animation to finish?
      setTimeout(() => {
        ctx.commit(mutationTypes.removeFloatingUnitWindow, id);
      }, 400);
    });
  }
};

export default actions;
