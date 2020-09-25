import { Unit, Application } from 'store/juju/state';

export interface DebugWindowState {
  visible: boolean;
  maximized: boolean;
}

export interface FloatingWindow {
  id: string;
  unit: Unit;
  app: Application;
  kind: FloatingWindowKindString;
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
  debugWindow: DebugWindowState;
  floatingWindows: FloatingWindow[];
}

const state: AppStateInterface = {
  debugWindow: {
    visible: false,
    maximized: false
  },
  floatingWindows: []
};

export default state;
