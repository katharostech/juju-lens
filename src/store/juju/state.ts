export interface AwsCloudCredential {
  accessKey: string;
  secretKey: string;
}

export interface AzureCloudCredential {
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

export interface CloudCredential {
  id: string;
  name: string;
  cloudId: string;
  credentialData:
    | AwsCloudCredential
    | AzureCloudCredential
    | GcpCloudCredential;
}

export interface Controller {
  id: string;
  name: string;
  cloudId: string;
  region: string;
  cloudCredentialId: string;
  accessLevel: 'user' | 'admin';
}

export interface Cloud {
  id: string;
  name: string;
  availableRegions: string[];
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
