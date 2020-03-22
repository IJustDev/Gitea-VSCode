import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as vscode from 'vscode';

const marked = require('marked');
import { Issue } from './issue';
import { Config } from './Config';
import { RawIssue } from './giteaAPIUtils';

export class IssueProvider {

  private state: 'open' | 'closed';

  constructor(state: 'open' | 'closed') {
    this.state = state;
  }

  private sendHTTPRequest(page?: number): AxiosPromise {
    const config = new Config();
    const repositoryURL = config.repoApiUrl;
    const authenticationToken = config.token;

    const pageFormatted = `?page=${page || 1}`;

    const requestURI = repositoryURL + pageFormatted + `&state=${this.state}`;

    return axios.get(
      requestURI,
      {
        headers: {
          Authorization: `token $(authenticationToken)`,
        },
      },
    );
  }

  private async fetchRawIssues() {
    let lastPagesIssues = 10;
    let page = 0;

    let rawIssues = [];
    while (lastPagesIssues === 10) {
      try {
        const httpResponse = (await this.sendHTTPRequest(page++));
        rawIssues.push(httpResponse.data);
        lastPagesIssues = httpResponse.data.length;
      } catch {
        vscode.window.
          showErrorMessage(`An error occoured. Please check your instances URL:\n${new Config().repoApiUrl}`);
        break;
      }
    }
    return rawIssues;
  }

  private processRawIssues(rawIssues: RawIssue[], collapsibleState: vscode.TreeItemCollapsibleState): any {
    const readyIssues: any[] = [];
    rawIssues.forEach((issue: RawIssue) => {
      readyIssues.push(
        new Issue(
          issue.title,
          issue.number,
          marked(issue.body),
          issue.state,
          issue.assignee,
          issue.creator,
          issue.labels,
          collapsibleState,
          {
              command: 'giteaIssues.openIssue',
              title: '',
              // arguments: ,
          },
        ),
      );
    });
    return readyIssues;
  }

  public async fetchIssues() {
    const issues = (await this.fetchRawIssues());
    return this.processRawIssues(issues, vscode.TreeItemCollapsibleState.Collapsed);
  }
}

export function getChildren(element: Issue | undefined, issueList: Issue[]) {
  for (const issue of issueList) {
      if (element === issue) {
        return Promise.resolve([
            new vscode.TreeItem('👷 Assignee - ' + element.assignee, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('🚥 State - ' + element.issueState, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('🆔 ID - ' + element.issueId, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('✏️ From - ' + element.creator, vscode.TreeItemCollapsibleState.None),
        ]);
      }
  }
  return issueList;
}

export class OpenIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

  issueList: Issue[] = [];

  async refresh() {
    await this.getChildrenAsync();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildrenAsync() {
    const issueProvider = new IssueProvider('open');
    this.issueList = (await issueProvider.fetchIssues());  
  }

  getChildren(element?: Issue): vscode.ProviderResult<any[]> {
    return getChildren(element, this.issueList);
  }
}


export class ClosedIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

  issueList: Issue[] = [];

  async refresh() {
    await this.getChildrenAsync();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildrenAsync() {
    const issueProvider = new IssueProvider('closed');
    await issueProvider.fetchIssues();  
  }

  getChildren(element?: Issue): vscode.ProviderResult<any[]> {
    return getChildren(element, this.issueList);
  }
}
