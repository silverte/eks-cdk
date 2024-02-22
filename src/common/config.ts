export enum ENV {
  DEV = 'dev',
  STG = 'stg',
  PRD = 'prd',
}
export default class Config {
  public readonly owner: string;
  public readonly environment: ENV;
  public readonly personalization: string;
  public readonly service: string;
  public readonly servicePrefix: string;
  public readonly eksAdminUser: string;

  constructor(env?: ENV) {
    this.owner = 'born2k';
    this.environment = env || ENV.DEV;
    this.personalization = env === ENV.PRD ? 'yes' : 'no';
    this.service = 'tubeplus';
    this.servicePrefix = `${this.service}-${this.environment}`;
    this.eksAdminUser = 'silverte';
  }
}
