import * as vscode from 'vscode';

import { showIssueHTML } from './template.html';
import { Issue } from './issue';
import { OpenIssuesProvider, ClosedIssuesProvider } from './issueProvider';

export function activate(context: vscode.ExtensionContext) {
  let openIssues: Array<Issue> = [];
  const openIssuesProvider = new OpenIssuesProvider();
  const closedIssuesProvider = new ClosedIssuesProvider();

  vscode.window.registerTreeDataProvider('open-issues', openIssuesProvider);
  vscode.window.registerTreeDataProvider('closed-issues', closedIssuesProvider);

  // TODO: Implement in next version.
  // vscode.commands.registerCommand('giteaIssues.createIssue', async () => {
  //     const panel = vscode.window.createWebviewPanel('createIssue', 'Create an new Issue', vscode.ViewColumn.Active, {});
  //     panel.webview.html = "";
  // });

  vscode.commands.registerCommand('giteaIssues.openIssue', (issue: Issue) => {
    for (let i = 0; i !== openIssues.length; i++) {
      let openIssue = openIssues[i];
      if (openIssue.issueId === issue.issueId) {
        return;
      }
    }
    const panel = vscode.window.createWebviewPanel('issue', issue.label, vscode.ViewColumn.Active, {});
    panel.webview.html = showIssueHTML(issue);
    openIssues.push(issue);
    panel.onDidDispose((event) => {
      for (let i = 0; i !== openIssues.length; i++) {
        let openIssue = openIssues[i];
        if (openIssue.issueId === issue.issueId) {
          openIssues.splice(openIssues.indexOf(issue), 1);
        }
      }
    });
  });

  vscode.commands.registerCommand('giteaIssues.refreshIssues', () => {
    openIssuesProvider.refresh();
    closedIssuesProvider.refresh();
  });
}

export function deactivate() {}
