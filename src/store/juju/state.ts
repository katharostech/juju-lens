export interface CloudCredential {
  id: string;
  name: string;
  cloudId: string;
  credentialData: { [key: string]: string };
}

export interface Controller {
  id: string;
  name: string;
  cloudId: string;
  region: string;
  cloudCredentialId: string;
  accessLevel: 'user' | 'admin';
}

export interface CredentialDataDef {
  key: string;
  label?: string;
  description?: string;
  isPasword?: boolean;
}

export interface Cloud {
  id: string;
  name: string;
  availableRegions: string[];
  requiredCredentials: CredentialDataDef[];
}

export interface Model {
  id: string;
  name: string;
}

export interface Application {
  id: string;
  name: string;
  modelId: string;
  charmId: string;
}

export type Relation = [ApplicationEndpoint, ApplicationEndpoint];

export interface ApplicationEndpoint {
  applicationId: string;
  endpointName: string;
}

export interface Unit {
  id: string;
  index: number;
  applicationId: string;
  machineId: string;
  exposedPorts: number[];
  status: UnitStatus;
  agentStatus: 'active' | 'idle';
}

export interface UnitStatus {
  severity: 'unknown' | 'maintenance' | 'blocked' | 'waiting' | 'active';
  message?: string;
}

export interface Machine {
  id: string;
  index: number;
  modelId: string;
  publicIp: string;
  status: 'waiting' | 'provisioning' | 'running' | 'offline';
}

export interface Charm {
  id: string;
  name: string;
  imageUrl: string;
  endpoints: CharmEndpoint[];
}

export interface CharmEndpoint {
  name: string;
  interface: string;
  mode: 'provides' | 'requires' | 'peer';
}

export interface JujuStateInterface {
  currentController: Controller | null;
  controllers: Controller[];
  clouds: Cloud[];
  cloudCredentials: CloudCredential[];
  models: Model[];
  applications: Application[];
  relations: Relation[];
  units: Unit[];
  machines: Machine[];
  store: Charm[];
}

/**
 * Any subset of the keys in the Juju state
 */
export interface PartialJujuState {
  currentConroller?: Controller | null;
  controllers?: Controller[];
  clouds?: Cloud[];
  cloudCredentials?: CloudCredential[];
  models?: Model[];
  applications?: Application[];
  relations?: Relation[];
  units?: Unit[];
  machines?: Machine[];
  store?: Charm[];
}

const state: JujuStateInterface = {
  currentController: null,
  controllers: [],
  clouds: [],
  cloudCredentials: [],
  models: [],
  applications: [],
  relations: [],
  units: [],
  machines: [],
  store: []
};

export default state;
