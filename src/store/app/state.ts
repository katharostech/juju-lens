import { Unit, Application } from 'store/juju/state';

export interface DebugWindowState {
  visible: boolean;
  maximized: boolean;
}

// TODO: Is app too much to add to the floating window? We really just needs the
// Apps name for the taskbar. This will probably change a lot when we hook it up
// to the API so I think it is fine for now.
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
