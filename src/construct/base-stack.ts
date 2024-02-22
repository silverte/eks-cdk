import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import Config from '../common/config';

export interface StackCommonProps extends cdk.StackProps {
  config: Config;
}
export class BaseStack extends cdk.Stack {
  protected readonly config: Config;
  constructor(scope: Construct, id: string, commonProps: StackCommonProps) {
    super(scope, id, commonProps);
    this.config = commonProps.config;
  }
  protected tag(scope: IConstruct, name: string, props?: cdk.TagProps) {
    tag(scope, name, this.config, props);
  }
  protected getVpc() {
    return Vpc.fromLookup(this, 'Vpc', {
      vpcName: `vpc-${this.config.servicePrefix}`,
    });
  }
}

export interface StackCommonProps extends cdk.StackProps {
  config: Config;
}
export class BaseNestedStack extends cdk.NestedStack {
  protected readonly config: Config;
  constructor(scope: Construct, id: string, commonProps: StackCommonProps) {
    super(scope, id, commonProps);
    this.config = commonProps.config;
  }
  protected tag(scope: IConstruct, name: string, props?: cdk.TagProps) {
    tag(scope, name, this.config, props);
  }
  protected getVpc() {
    return Vpc.fromLookup(this, 'Vpc', {
      vpcName: `vpc-${this.config.servicePrefix}`,
    });
  }
}

function tag(scope: IConstruct, name: string, config: Config, props?: cdk.TagProps): void {
  /**
   * name: (Resource Type)-(servicePrefix)-(function)-(number)
   * e.g. eks-tube-plus-dev
   */
  if (name === undefined || name === null) {
    throw new Error('name is a required for resource tags.');
  }
  cdk.Tags.of(scope).add('Name', name, props);
  cdk.Tags.of(scope).add('owner', config.owner);
  cdk.Tags.of(scope).add('environment', config.environment);
  cdk.Tags.of(scope).add('personalization', config.personalization);
  cdk.Tags.of(scope).add('service', config.service);
}