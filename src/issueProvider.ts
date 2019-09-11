import * as vscode from 'vscode';

import { Issue } from './issue';
import {fetchIssues} from './issueHelper';

export class OpenIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

  issueList: Issue[] = [];

  async refresh() {
    this.fetchIssueList().then(() => {});
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

  async fetchIssueList() {
    fetchIssues("open").then((response) => {
        this.issueList = response;
    });
  }

  getChildren(element?: Issue): vscode.ProviderResult<any[]> {
    return getChildsOfElement(element, this.issueList);
  }
}

export class ClosedIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

  issueList: Issue[] = [];

  async refresh() {
    this.fetchIssueList().then(() => {});
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

  async fetchIssueList() {
    fetchIssues("closed").then((response) => {
        this.issueList = response;
    });
  }

  getChildren(element?: Issue): vscode.ProviderResult<any[]> {
    return getChildsOfElement(element, this.issueList);
  }
}

export function getChildsOfElement(element: Issue | undefined, issueList: Issue[]) {
  for (const issue of issueList) {
      if (element === issue) {
        let childItems: vscode.TreeItem[] = [
            new vscode.TreeItem('👷 Assignee - ' + issue.assignee, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('🚥 State - ' + issue.issueState, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('🆔 ID - ' + issue.issueId, vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('✏️ From - ' + issue.creator, vscode.TreeItemCollapsibleState.None),
          ];
          return Promise.resolve(childItems);
      }
  }
  return issueList;
}
