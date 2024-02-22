import { Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { BaseStack, StackCommonProps } from '../../construct/base-stack';

export default class VpcStack extends BaseStack {
  constructor(scope: Construct, id: string, props: StackCommonProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, this.config.service, {
      vpcName: `vpc-${this.config.servicePrefix}`,
      availabilityZones: [
        Stack.of(this).availabilityZones[0],
        Stack.of(this).availabilityZones[1],
        //Stack.of(this).availabilityZones[2],
      ],
      subnetConfiguration: [
        {
          cidrMask: 22,
          name: 'Ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 22,
          name: 'EKS',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        // {
        //   cidrMask: 26,
        //   name: 'MSK',
        //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        // },
        {
          cidrMask: 26,
          name: 'RDS',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGatewayProvider: ec2.NatProvider.gateway(),
      natGateways: 2,
      natGatewaySubnets: {
        subnetGroupName: 'Ingress',
      },
    });
    vpc.addInterfaceEndpoint('codecommit', {
      service: ec2.InterfaceVpcEndpointAwsService.CODECOMMIT,
    });
    vpc.addInterfaceEndpoint('ec2', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2,
    });
    vpc.addInterfaceEndpoint('ecr', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    });
    vpc.addInterfaceEndpoint('ecr-dkr', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });
    vpc.addInterfaceEndpoint('eks', {
      service: ec2.InterfaceVpcEndpointAwsService.EKS,
    });
    vpc.addInterfaceEndpoint('elasticloadbalancing', {
      service: ec2.InterfaceVpcEndpointAwsService.ELASTIC_LOAD_BALANCING,
    });
    vpc.addInterfaceEndpoint('lambda', {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
    });
    vpc.addInterfaceEndpoint('git-codecommit', {
      service: ec2.InterfaceVpcEndpointAwsService.CODECOMMIT_GIT,
    });
    vpc.addInterfaceEndpoint('logs', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });
    vpc.addInterfaceEndpoint('monitoring', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_MONITORING,
    });
    vpc.addInterfaceEndpoint('secretsmanager', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });
    vpc.addInterfaceEndpoint('sts', {
      service: ec2.InterfaceVpcEndpointAwsService.STS,
    });
  }
}