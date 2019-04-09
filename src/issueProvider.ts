import * as vscode from "vscode";
import axios from "axios";

export class IssueProvider implements vscode.TreeDataProvider<Issue> {

    constructor() {
    }

    getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: Issue): vscode.ProviderResult<any[]> {
        axios.get("http://git.mypenink.com/api/v1/repos/MyPenInk/Frontend/issues", { headers: { Authorization: "token baab9fb94100c3a4f22213a0d0d0b8ce03c55bec" } }).then(res => {
            console.log(res.data);
            for (const issue in res.data) {
                console.log(issue);
                vscode.window.showInformationMessage(issue["number"]);
            }
        }).catch(err => {
            console.log(err);
        });
        let issues = [new Issue("Test", 1, "Bring dich um", "open", ["IJustDev", "OjunbamO"], vscode.TreeItemCollapsibleState.None)];
        return Promise.resolve(issues);
    }


}

export class Issue extends vscode.TreeItem {

    constructor(public readonly label: string,
        public issueId: number,
        public body: string,
        public issueState: string,
        public assignees: string[],
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }

    get tooltip() {
        return "Tooltip!";
    }
    contextValue = 'issue';
}