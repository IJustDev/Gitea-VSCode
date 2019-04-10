import * as vscode from 'vscode';

import { showIssueHTML } from './template.html';
import { Issue } from "./issue";
import { RepositoryInformationManager } from './configurationProvider';
import { OpenIssuesProvider, ClosedIssuesProvider } from './issueProvider';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('giteaIssues.initRepo', () => {
        initializeIssueTracker();
    });
    context.subscriptions.push(disposable);

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
        const panel = vscode.window.createWebviewPanel('issue', issue.label,
            vscode.ViewColumn.Active,
            {});
        panel.webview.html = showIssueHTML(issue);
    });

    vscode.commands.registerCommand('giteaIssues.refreshIssues', () => {
        openIssuesProvider.refresh();
        closedIssuesProvider.refresh();
    });

}

export function deactivate() { }

export async function initializeIssueTracker() {
    if (vscode.workspace.rootPath === undefined) {
        return vscode.window.showErrorMessage("No project opened!");
    }
    let Token, Domain, Owner, Name;
    await vscode.window.showInputBox({
        placeHolder: "Enter your gitea token here",
    }).then(token => {
        Token = token === undefined ? "" : token;
    });
    await vscode.window.showInputBox({
        placeHolder: "Domain from your gitea server without 'https://'",
    }).then(domain => {
        Domain = domain === undefined ? "" : domain;
    });
    await vscode.window.showInputBox({
        placeHolder: "Repository Owner",
    }).then(owner => {
        Owner = owner === undefined ? "" : owner;
    });
    await vscode.window.showInputBox({
        placeHolder: "Repository Name",
    }).then(name => {
        Name = name === undefined ? "" : name;
    });
    const repoInfo = {
        token: Token,
        domain: Domain,
        repo_owner: Owner,
        repo_name: Name,
    };
    const rpim = new RepositoryInformationManager();
    rpim.saveRepoInformation(vscode.workspace.rootPath, repoInfo);
}