export interface AwsCloudCredential {
  name: string;
  accessKey: string;
  secretKey: string;
}

export interface AzureCloudCredential {
  name: string;
  adAId: string;
  sId: string;
  adAP: string;
}

export interface GcpJsonFileCloudCred {
  data: string;
}

export interface GcpOauth2CloudCred {
  clientId: string;
  email: string;
  privateKey: string;
  projectId: string;
}

export interface GcpCloudCredential {
  projectId: string;
  gcpCredKind: GcpJsonFileCloudCred | GcpOauth2CloudCred;
}

export type CloudCredential =
  | AwsCloudCredential
  | AzureCloudCredential
  | GcpCloudCredential;

export interface Controller {
  name: string;
  cloud: string;
  cloudCredential: string;
  region: string;
  accessLevel: 'user' | 'admin';
}

export interface Cloud {
  name: string;
  availableRegions: string[];
}

export interface JujuStateInterface {
  currentController: string | null;
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
