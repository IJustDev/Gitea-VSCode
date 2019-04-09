// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IssueProvider, Issue } from './issueProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const issueProvider = new IssueProvider();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	vscode.window.registerTreeDataProvider('open-issues', issueProvider);
	vscode.commands.registerCommand('giteaIssues.openIssue', (issue: Issue) => {
		const panel = vscode.window.createWebviewPanel('issue', 'Issue #1',
			vscode.ViewColumn.Active,
			{});
		panel.webview.html = "<h1>Issue #" + issue.issueId + "!</h1>";
		panel.webview.html += "<p>Status: " + issue.issueState + "</p>";
		panel.webview.html += "<p>Assignees: " + issue.assignees + "</p>";
		panel.webview.html += "<p>" + issue.body + "</p>";
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
}

// this method is called when your extension is deactivated
export function deactivate() { }
