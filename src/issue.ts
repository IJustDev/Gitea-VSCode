import * as vscode from "vscode";

export class Issue extends vscode.TreeItem {

    constructor(public readonly label: string,
        public issueId: number,
        public body: string,
        public issueState: string,
        public assignee: string,
        public firstlabel: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }

    get tooltip() {
        return this.label + " - " + this.assignee;
    }
    contextValue = 'issue';
}