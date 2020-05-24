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
  region: string;
  accessLevel: 'user' | 'admin';
}

export interface Cloud {
  availableRegions: string[];
}

export interface JujuStateInterface {
  controllers: Controller[];
  clouds: { [key: string]: Cloud };
  cloudCredentials: CloudCredential[];
}

const state: JujuStateInterface = {
  controllers: [],
  clouds: {},
  cloudCredentials: []
};

export default state;
