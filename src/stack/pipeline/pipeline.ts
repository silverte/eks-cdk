import { aws_codepipeline_actions, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as yaml from 'yaml';
import { Construct } from 'constructs';
import { ENV } from '../../common/config';
import { BaseStack, StackCommonProps } from '../../construct/base-stack';

export default class PipelineStack extends BaseStack {
  constructor(scope: Construct, id: string, commonProps: StackCommonProps) {
    super(scope, id, commonProps);
    const sourceOutput = new codepipeline.Artifact();
    const dockerOutput = new codepipeline.Artifact('docker');
    const helmOutput = new codepipeline.Artifact('helm');

    // App ECR repository
    const containerRepository = new ecr.Repository(this, 'containerRepo', {
      repositoryName: `ecr-${this.config.service}-app`,
      imageScanOnPush: true,
      removalPolicy: this.config.environment === ENV.DEV ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });
    this.tag(containerRepository, `ecr-${this.config.service}-app`);

    // App git repository
    const appRepository = new codecommit.Repository(this, 'appRepo', {
      repositoryName: `git-${this.config.service}-app`,
      description: 'App code',
      // code:
    });
    this.tag(appRepository, `git-${this.config.service}-app`);

    // helm git repository
    const helmRepository = new codecommit.Repository(this, 'helmRepo', {
      repositoryName: `git-${this.config.service}-helm`,
      description: 'Helm code',
    });
    this.tag(helmRepository, `git-${this.config.service}-helm`);

    // pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `pipeline-${this.config.service}-app`,
    });
    this.tag(pipeline, `pipeline-${this.config.service}-app`);

    // ssm parameter store
    // new ssm.StringParameter(this, 'ssm-git-email', {
    //   parameterName: '/prod/codecommit-repo/e-mail',
    //   stringValue: 'silverte@sk.com',
    // });

    new CfnOutput(this, 'app-repo', {
      value: appRepository.repositoryCloneUrlHttp,
    });

    // buildspec.yaml
    const path = require('path');
    const fs = require('fs');
    const buildspecDocker = codebuild.BuildSpec.fromSourceFilename('buildspec.yaml');
    const stringified: string = fs.readFileSync(path.join(__dirname, './ecr-buildspec.yaml'), {
      encoding: 'utf-8',
    });
    const buildspecEcrPush = codebuild.BuildSpec.fromObjectToYaml(yaml.parse(stringified));

    // Docker codebuild
    const dockerBuild = new codebuild.PipelineProject(this, 'dockerBuild', {
      projectName: `codebuild-${this.config.service}-docker`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
      },
      environmentVariables: {
        REPO_ECR: { value: containerRepository.repositoryUri },
      },
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
      buildSpec: buildspecDocker,
    });

    // ECR push codebuild
    const ecrPushBuild = new codebuild.PipelineProject(this, 'ecrPushBuild', {
      projectName: `codebuild-${this.config.service}-ecr-push`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
      },
      environmentVariables: {
        HELM_REPO_URL: { value: helmRepository.repositoryCloneUrlHttp },
        HELM_REPO_NAME: { value: `git-${this.config.service}-helm` },
        REPO_ECR: { value: containerRepository.repositoryUri },
      },
      buildSpec: buildspecEcrPush,
    });

    dockerBuild.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ecr:BatchCheckLayerAvailability', 'ecr:GetDownloadUrlForLayer', 'ecr:BatchGetImage'],
        resources: [
          `arn:${Stack.of(this).partition}:ecr:${Stack.of(this).region}:${Stack.of(this).account}:repository/*`,
        ],
      })
    );

    ecrPushBuild.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['codecommit:GitPull', 'codecommit:GitPush'],
        resources: ['*'],
      })
    );

    ecrPushBuild.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ssm:GetParameters'],
        resources: ['*'],
      })
    );

    containerRepository.grantPullPush(dockerBuild);

    // pipeline
    const sourceAction = new aws_codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommitSource',
      repository: appRepository,
      output: sourceOutput,
      branch: 'main',
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: 'DockerBuildAndPushECR',
      actions: [
        new aws_codepipeline_actions.CodeBuildAction({
          actionName: 'DockerBuildAndPushECR',
          project: dockerBuild,
          input: sourceOutput,
          outputs: [dockerOutput],
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'ImageTagPushToHelm',
      actions: [
        new aws_codepipeline_actions.CodeBuildAction({
          actionName: 'ImageTagPushToHelm',
          project: ecrPushBuild,
          input: dockerOutput,
          outputs: [helmOutput],
        }),
      ],
    });
  }
}
