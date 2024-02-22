import { App } from 'aws-cdk-lib';
import Config from './common/config';
import { EksStack } from './stack/eks/eks-stack';
import VpcStack from './stack/vpc/vpc-stack';
import PipelineStack from './stack/pipeline/pipeline';

// for development, use account/region from cdk cli
const account = process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;

const app = new App();

const config = new Config();
const stackCommonProps = { config, env: { account, region } };

new VpcStack(app, 'Vpc', stackCommonProps);
new EksStack(app, 'Eks', stackCommonProps);
new PipelineStack(app, 'Pipeline', stackCommonProps);

app.synth();
