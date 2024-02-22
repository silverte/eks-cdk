import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.102.0',
  defaultReleaseBranch: 'main',
  name: 'eks-cdk',
  projenrcTs: true,
  tsconfig: {
    compilerOptions: {
      alwaysStrict: false,
      declaration: true,
      esModuleInterop: false,
      experimentalDecorators: false,
      inlineSourceMap: false,
      inlineSources: false,
      strict: false,
      strictNullChecks: false,
      strictPropertyInitialization: false,
      stripInternal: false,
      noEmitOnError: false,
      noFallthroughCasesInSwitch: false,
      noImplicitAny: false,
      noImplicitReturns: false,
      noImplicitThis: false,
      noUnusedLocals: false,
      noUnusedParameters: false,
      resolveJsonModule: false,
    },
  },

  deps: ['@aws-cdk/lambda-layer-kubectl-v27', 'yaml'] /* Runtime dependencies of this module. */,
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
