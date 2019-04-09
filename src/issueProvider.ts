import * as vscode from "vscode";
import axios from "axios";

export class IssueProvider implements vscode.TreeDataProvider<Issue> {

    private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

    issueList: any[] = [];

    constructor() {
        this.getChildrenAsync();
        const id = setInterval(() => {
            if (this.issueList.length === 0) {
                this._onDidChangeTreeData.fire();
            } else {
                clearInterval(id);
            }
        }, 1 * 10);
        setInterval(() => {
            this._onDidChangeTreeData.fire();
        }, 10 * 1000);
    }

    getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildrenAsync() {
        this.issueList = [];
        for (let i = 0; i !== 10; i++) {
            await axios.get("http://git.mypenink.com/api/v1/repos/MyPenInk/Frontend/issues?page=" + i, { headers: { Authorization: "token baab9fb94100c3a4f22213a0d0d0b8ce03c55bec" } }).then(res => {
                for (const issue of res.data) {
                    const title = issue["title"];
                    const id = issue["number"];
                    const body = issue["body"];
                    const state = issue["state"];
                    const assignee = issue["assignee"] === null ? "None" : issue["assignee"]["username"];
                    const issueForList = new Issue("#" + id + " - " + title, id, body, state, assignee, "Frontend", vscode.TreeItemCollapsibleState.None);
                    this.issueList.push(issueForList);
                }
            }).catch(err => {
                console.log(err);
            });
        }

        console.log(this.issueList);
    }
    getChildren(element?: Issue): vscode.ProviderResult<any[]> {
        return this.issueList;
    }


}

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