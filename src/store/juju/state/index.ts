export enum UnitStatusSeverity {
  // "Green" states
  active,
  started,
  // "Yellow" states
  maintenance,
  unknown, // TODO: Should unknown be a "yellow" state?
  waiting,
  // "Red" states
  blocked,
  error,
  terminated
}

export type UnitStatusSeverityString = keyof typeof UnitStatusSeverity;

export interface Status {
  current: UnitStatusSeverityString;
  message: string;
  since: string; // TODO: This will be a timestamp, should it be a date?
  version: string;
}

export interface Model {
  /** Id used internally by Juju lens to uniquely identify the resource */
  lensId: string;
  'model-uuid': string;
  name: string;
  life: 'alive' | string; // TODO: other enums
  owner: string;
  'controller-uuid': string;
  'is-controller': boolean;
  config: { [key: string]: string };
  status: Status;
  // TODO: sla, constraints
}

export interface Machine {
  /** Id used internally by Juju lens to uniquely identify the resource */
  lensId: string;
  'model-uuid': string;
  id: string;
  'instance-id': string;
  'agent-status': Status;
  'instance-status': Status;
  life: 'alive' | string; // TODO: other enums
  series: string;
  'container-type': string;
  'supported-containers': string[];
  'supported-containers-known': boolean;
  'hardware-characteristics': {
    arch: string;
    mem: number;
    'cpu-cores': number;
  };
  jobs: string[];
  addresses: {
    value: string;
    type: 'ipv4' | 'ipv6';
    scope: 'local-cloud' | 'local-machine' | string; // TODO: Other enums?
  }[];
  'has-vote': boolean;
  'wants-vote': boolean;
}

export interface Charm {
  /** Id used internally by Juju lens to uniquely identify the resource */
  lensId: string;
  'model-uuid': string;
  'charm-url': string;
  'charm-version': string;
  life: 'alive' | string; // TODO: other enums
  profile?: unknown; // TODO
}

export interface Unit {
  /** Id used internally by Juju lens to uniquely identify the resource */
  lensId: string;
  'model-uuid': string;
  name: string;
  application: string;
  series: string;
  'charm-url': string;
  life: 'alive' | string; // TODO: other enums
  'public-address': string;
  'private-address': string;
  'machine-id': string;
  ports: number[];
  'port-ranges': string[];
  principal: string;
  subordinate: boolean;
  'workload-status': Status;
  'agent-status': Status;
}

export interface Application {
  /** Id used internally by Juju lens to uniquely identify the resource */
  lensId: string;
  'model-uuid': string;
  name: string;
  exposed: boolean;
  'charm-url': string;
  'owner-tag': string;
  life: 'alive' | string; // TODO: other enums
  'min-units': number;
  subordinate: boolean;
  status: Status;
  'workload-version': string;
  // TODO: constraints
}

// TODO: Implement a connection status indicator and corresponding GUI
// elements.

export interface ControllerData {
  models: { [key: string]: Model };
  machines: { [key: string]: Machine };
  charms: { [key: string]: Charm };
  units: { [key: string]: Unit };
  applications: { [key: string]: Application };
}

export interface Controller extends ControllerData {
  /** The URL to the controller */
  host: string;
  port: number;
  username: string;
  password: string;

  // TODO: static type
  /** The controller API connection */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conn?: any;
  /** The handle to the wather that monitors the controller's models, units, etc. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controllerWatchHandle?: any;
}

export interface JujuStateInterface {
  currentController: 'All' | string;
  /** Controllers indexed by unique name as provided by user */
  controllers: { [key: string]: Controller };
}

const state: JujuStateInterface = {
  currentController: 'All',
  controllers: {}
};

export default state;