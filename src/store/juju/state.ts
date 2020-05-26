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

export interface JujuStateInterface {
  currentController: Controller | null;
  controllers: Controller[];
  clouds: Cloud[];
  cloudCredentials: CloudCredential[];
}

const state: JujuStateInterface = {
  currentController: null,
  controllers: [],
  clouds: [],
  cloudCredentials: []
};

export default state;
