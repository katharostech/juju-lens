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
  controllers: [
    {
      name: 'my-controller',
      cloud: 'aws',
      region: 'us-west'
    }
  ],
  clouds: {
    aws: {
      availableRegions: ['us-west', 'us-east', 'asia']
    },
    azure: {
      availableRegions: ['centralus', 'centralasia']
    }
  },
  cloudCredentials: [
    {
      name: 'my-aws-creds',
      accessKey: 'no-so-secret-access-key',
      secretKey: 'super-secret-secret-key'
    },
    {
      name: 'my-azure-creds',
      adAId: 'y5dh1MGzHBv541YA8ONI3zGjTkLpnf46TCNbWDxi',
      sId: 'iBMlj6jrl93i27NBYrwNvJYXq2UbhQ+VW29TSfKD',
      adAP: 'ECEfD+mNfq7YWRwTgfW5vwfxYRp+y7O9Yts5'
    }
  ]
};

export default state;
