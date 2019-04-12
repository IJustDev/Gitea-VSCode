import * as vscode from "vscode";
import * as path from "path";

export class Issue extends vscode.TreeItem {

    constructor(public readonly label: string,
        public issueId: number,
        public body: string,
        public issueState: string,
        public assignee: string,
        public labels: any[],
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }

    get tooltip() {
        return this.label + " - " + this.assignee;
    }

    labelDependentIcon(dark: boolean = false): string {
        let filename = "";
        if (this.labels.length === 0) {
            filename = "issue";
        } else {
            this.labels[0].name.toLowerCase() === "feature" ? filename = "feature" : filename = this.labels[0].name.toLowerCase() === "bug" ? "bug" : "issue";
        }
        return path.join(__filename, '..', '..', 'resources', dark ? 'dark' : 'light', filename + '.svg');
    }

    iconPath = {
        light: this.labelDependentIcon(),
        dark: this.labelDependentIcon(true)
    };

    contextValue = 'issue';
}