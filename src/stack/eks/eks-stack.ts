// eslint-disable-next-line import/no-extraneous-dependencies
import { KubectlV27Layer } from '@aws-cdk/lambda-layer-kubectl-v27';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import addOnNestedStack from './addon-nested-stack';
import { BaseStack, StackCommonProps } from '../../construct/base-stack';

export class EksStack extends BaseStack {
  public readonly cluster: eks.Cluster;

  constructor(scope: Construct, id: string, commonProps: StackCommonProps) {
    super(scope, id, commonProps);
    const vpc = this.getVpc();

    this.cluster = new eks.Cluster(this, this.config.service, {
      version: eks.KubernetesVersion.V1_27,
      albController: { version: eks.AlbControllerVersion.V2_5_1 },
      clusterLogging: [
        // eks.ClusterLoggingTypes.API,
        // eks.ClusterLoggingTypes.AUTHENTICATOR,
        // eks.ClusterLoggingTypes.SCHEDULER,
        // eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
        // eks.ClusterLoggingTypes.AUDIT,
      ],
      clusterName: `eks-${this.config.servicePrefix}`,
      defaultCapacity: 0,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.LARGE),
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      kubectlLayer: new KubectlV27Layer(this, 'KubectlLayer'),
      mastersRole: this.createEksMasterRole(),
      outputClusterName: true,
      outputConfigCommand: true,
      outputMastersRoleArn: true,
      vpc: vpc,
      vpcSubnets: [{ subnetGroupName: 'EKS' }],
    });
    this.tag(this.cluster, `eks-${this.config.servicePrefix}`);

    // aws-auth mapping to Account User
    const admin = iam.User.fromUserName(this, commonProps.env?.account!, this.config.eksAdminUser);
    this.cluster.awsAuth.addUserMapping(admin, { groups: ['system:masters'] });
    // aws-auth mapping to IAM Role
    // this.cluster.awsAuth.addAccount(commonProps.env?.account!);
    // this.cluster.awsAuth.addMastersRole(this.createEksMasterRole());

    const serviceNodeGroup = this.cluster.addNodegroupCapacity(this.config.service, {
      desiredSize: 1,
      minSize: 1,
      maxSize: 3,
      instanceTypes: [new ec2.InstanceType('m5.large')],
      nodegroupName: `ng-${this.config.service}-service`,
    });
    this.tag(serviceNodeGroup, `ng-${this.config.service}`);

    const managementNodeGroup = this.cluster.addNodegroupCapacity(this.config.service, {
      desiredSize: 1,
      minSize: 1,
      maxSize: 1,
      //instanceTypes: [new ec2.InstanceType('t3.large')],
      nodegroupName: `ng-${this.config.service}-management`,
      taints: [{ effect: eks.TaintEffect.NO_SCHEDULE, key: 'dedicated', value: 'management' }],
    });
    this.tag(managementNodeGroup, `ng-${this.config.service}`);

    // addOn nested stack
    new addOnNestedStack(this, 'addOnNestedStack', commonProps, this.cluster);
  }
  private createEksMasterRole(): iam.Role {
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ec2.amazonaws.com')),
      roleName: `role-${this.config.servicePrefix}-eks-master`,
    });
    this.tag(role, `role-${this.config.servicePrefix}-eks-master`);
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
    return role;
  }
}

// const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
//   launchTemplateData: {
//     //instanceType: "m6i.4xlarge",
//     blockDeviceMappings: [
//       {
//         deviceName: '/dev/xvda',
//         ebs: {
//           encrypted: true,
//           volumeType: 'gp3',
//           volumeSize: 100,
//           iops: 3000,
//         },
//       },
//     ],
//     metadataOptions: {
//       httpTokens: 'required',
//       httpPutResponseHopLimit: 2,
//     },
//     tagSpecifications: [
//       {
//         resourceType: 'instance',
//         tags: [
//           {
//             key: 'Name',
//             value: cdk.Fn.join('-', ['ec2', eksCluster.clusterName, 'nodes']),
//           },
//         ],
//       },
//     ],
//     securityGroupIds: securityGroupId,
//   },
//   launchTemplateName: cdk.Fn.join('-', ['lt', eksCluster.clusterName, 'ng']),
// });
