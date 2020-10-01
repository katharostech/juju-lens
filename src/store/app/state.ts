import { Unit, Application } from 'store/juju/state';

export interface LensLogWindowState {
  minimized: boolean;
  maximized: boolean;
  /** Activated indicates whether the window is visible, either minimized or
   * not. If it is not activated it will not exist at all. */
  activated: boolean;
  zIndex: number;
}

export interface FloatingUnitWindow {
  id: string;
  kind: FloatingWindowKindString;
  // App and unit should only be null for the `jujuLensLog` type
  unit: Unit;
  app: Application;
  visible: boolean;
  maximized: boolean;
  zIndex: number;
}

export enum FloatingWindowKind {
  log,
  terminal
}

export type FloatingWindowKindString = keyof typeof FloatingWindowKind;

export interface AppStateInterface {
  lensLogWindow: LensLogWindowState;
  floatingUnitWindows: FloatingUnitWindow[];
}

const state: AppStateInterface = {
  lensLogWindow: {
    minimized: false,
    maximized: false,
    activated: false,
    zIndex: 0
  },
  floatingUnitWindows: []
};

export default state;
