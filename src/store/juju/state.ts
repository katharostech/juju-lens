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

export interface JujuStateInterface {
  cloudCredentials: CloudCredential[];
}

const state: JujuStateInterface = {
  cloudCredentials: [
    {
      name: 'my-aws-creds-1',
      accessKey: 'no-so-secret-access-key',
      secretKey: 'super-secret-secret-key'
    }
  ]
};

export default state;
