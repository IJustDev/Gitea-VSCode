import axios from 'axios';
import * as vscode from 'vscode';

const marked = require('marked');
import { Issue } from './issue';
import { Config } from './Config';

export class OpenIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

  issueList: Issue[] = [];

  async refresh() {
    await this.getChildrenAsync();
    this._onDidChangeTreeData.fire();
  }

  constructor() {
    // Auto update the issuelist after 10 minutes
    setInterval(() => {
      this.refresh();
    }, 10 * 60 * 1000);
  }

  getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  /**
   * Returns a list of all open issues;
   */
  async getChildrenAsync() {
    this.issueList = [];
    const config = new Config();
    const repoUri = config.repoApiUrl;
    const token = config.token;
    let stop = false;
    for (let i = 0; i !== 10; i++) {
      await axios
        .get(repoUri + '?page=' + i, { headers: { Authorization: 'token ' + token } })
        .then((res) => {
          if (res.data.length === 0) {
            stop = true;
            return;
          }
          parseToIssues(res, this.issueList);
        })
        .catch((err) => {
          stop = true;
          vscode.window.showErrorMessage("An error occoured. Please check your repository url: " + repoUri);
          return;
        });
      if (stop) {
        return;
      }
    }
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

  constructor() {
    setInterval(() => {
      this.refresh();
    }, 10 * 60 * 1000);
  }

  getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildrenAsync() {
    this.issueList = [];
    const config = new Config();
    const repoUri = config.repoApiUrl;
    const token = config.token;
    let stop = false;
    for (let i = 0; i !== 10; i++) {
      await axios
        .get(repoUri + '?state=closed&page=' + i, { headers: { Authorization: 'token ' + token } })
        .then((res) => {
          console.log(res.data);
          if (res.data.length === 0) {
            stop = true;
            return;
          }
          parseToIssues(res, this.issueList);
        })
        .catch(() => {
          stop = true;
          vscode.window.showErrorMessage("An error occoured. Please check your repository url: " + repoUri);
          return;
        });
      if (stop) {
        return;
      }
    }
  }
  getChildren(element?: Issue): vscode.ProviderResult<any[]> {
    return getChildren(element, this.issueList);
  }
}

export function getChildren(element: Issue | undefined, issueList: Issue[]) {
  for (const issue of issueList) {
    if (element === issue) {
      let childItems: vscode.TreeItem[] = [
        new vscode.TreeItem('👷 Assignee - ' + element.assignee, vscode.TreeItemCollapsibleState.None),
        new vscode.TreeItem('🚥 State - ' + element.issueState, vscode.TreeItemCollapsibleState.None),
        new vscode.TreeItem('🆔 ID - ' + element.issueId, vscode.TreeItemCollapsibleState.None),
        new vscode.TreeItem('✏️ From - ' + element.creator, vscode.TreeItemCollapsibleState.None),
      ];
      return Promise.resolve(childItems);
    }
  }
  return issueList;
}

export function parseToIssues(res: any, issueList: Issue[], collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed) {
  for (const issue of res.data) {
    const id = issue['number'];
    let isAlreadyInList = false;
    issueList.forEach((issueOfList) => {
      if (id === issueOfList.issueId) {
        isAlreadyInList = true;
      }
    });
    if (isAlreadyInList) {
      continue;
    }
    const title = issue['title'];
    const body = marked(issue['body']);
    const state = issue['state'];
    const assignee = issue['assignee'] === null ? 'None' : issue['assignee']['username'];
    const labels = issue['labels'];
    const creator = issue['user']['username'];
    const tmpIssue = new Issue('#' + id + ' - ' + title, id, body, state, assignee, creator, labels, collapsibleState);
    const issueForList = new Issue(
      tmpIssue.label,
      tmpIssue.issueId,
      tmpIssue.body,
      tmpIssue.issueState,
      tmpIssue.assignee,
      tmpIssue.creator,
      tmpIssue.labels,
      tmpIssue.collapsibleState,
      {
        command: 'giteaIssues.openIssue',
        title: '',
        arguments: [tmpIssue],
      }
    );
    issueList.push(issueForList);
  }
}
