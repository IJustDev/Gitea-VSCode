import { html } from './template.html';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IssueProvider, Issue } from './issueProvider';
import { RepositoryInformationManager } from './configurationProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const issueProvider = new IssueProvider();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    let disposable = vscode.commands.registerCommand('giteaIssues.initRepo', async () => {
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
    });
    context.subscriptions.push(disposable);

    vscode.window.registerTreeDataProvider('open-issues', issueProvider);
    vscode.commands.registerCommand('giteaIssues.openIssue', (issue: Issue) => {
        const panel = vscode.window.createWebviewPanel('issue', issue.label,
            vscode.ViewColumn.Active,
            {});
        panel.webview.html = html(issue);
    });

    vscode.commands.registerCommand('giteaIssues.refreshIssues', () => {
        issueProvider.refresh();
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
}

// this method is called when your extension is deactivated
export function deactivate() { }
