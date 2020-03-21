import { workspace, window } from 'vscode';

interface ConfigStorage {
  token: string;
  instanceURL: string;
  owner: string;
  repo: string;
}

export interface ConfigTypes extends ConfigStorage {
  readonly repoApiUrl: string;
}

export class Config implements ConfigTypes {
  private get storage() {
    return workspace.getConfiguration('gitea', null);
  }

  private loadConfigValue<T extends keyof ConfigStorage>(configKey: T, type: 'string' | 'boolean' | 'number', acceptDetault = false): ConfigStorage[T] {
    if (!acceptDetault && !this.storage.has(configKey)) {
      window.showErrorMessage("Gitea-VSCode didn't find a required configuration value: " + configKey);
      throw new Error(`Failed to load configuration: "${configKey}"`);
    }

    const value = this.storage.has(configKey)
      ? (this.storage.get(configKey) as ConfigStorage[T])
      : (this.storage.inspect(configKey) as { defaultValue: ConfigStorage[T]; key: string }).defaultValue;

    if (typeof value === type && (type !== 'string' || (value as string).length > 0)) {
      return value as ConfigStorage[T];
    }

    window.showErrorMessage('Gitea-VSCode failed to load a configuration value that is needed: ' + configKey);
    throw new Error(`Failed to load configuration: "gitea.${configKey}"`);
  }

  public get token() {
    return this.loadConfigValue('token', 'string');
  }

  public set token(value) {
    this.storage.update('token', value);
  }

  public set instanceUrl(value: string) {
    this.storage.update('instanceURL', value);
  }

  public get instanceURL(): any {
    return this.loadConfigValue('instanceURL', 'string');
  }

  public get owner() {
    return this.loadConfigValue('owner', 'string');
  }

  public set owner(value) {
    this.storage.update('owner', value);
  }

  public get repo() {
    return this.loadConfigValue('repo', 'string');
  }

  public set repo(value) {
    this.storage.update('repo', value);
  }
  
  public get repoApiUrl() {
    return this.instanceURL + '/api/v1/repos/' + this.owner + '/' + this.repo + '/issues';
  }
}
