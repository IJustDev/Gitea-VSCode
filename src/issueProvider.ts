import * as vscode from "vscode";
import axios from "axios";
import { RepositoryInformationManager } from "./configurationProvider";

export class IssueProvider implements vscode.TreeDataProvider<Issue> {

    private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined> = new vscode.EventEmitter<Issue | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Issue | undefined> = this._onDidChangeTreeData.event;

    issueList: Issue[] = [];

    async refresh() {
        await this.getChildrenAsync();
        this._onDidChangeTreeData.fire();
    }

    constructor() { }

    getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildrenAsync() {
        this.issueList = [];
        const repoMng = new RepositoryInformationManager();
        const repoUri = repoMng.repoApiUrl(vscode.workspace.rootPath);
        console.log(repoUri);
        const token = repoMng.token(vscode.workspace.rootPath);
        let stop = false;
        for (let i = 0; i !== 10; i++) {
            await axios.get(repoUri + "?page=" + i, { headers: { Authorization: "token " + token } }).then(res => {
                for (const issue of res.data) {
                    const id = issue["number"];
                    let isAlreadyInList = false;
                    this.issueList.forEach((issueOfList) => {
                        if (id === issueOfList.issueId) {
                            isAlreadyInList = true;
                        }
                    });
                    if (isAlreadyInList) {
                        continue;
                    }
                    const title = issue["title"];
                    const body = issue["body"];
                    const state = issue["state"];
                    const assignee = issue["assignee"] === null ? "None" : issue["assignee"]["username"];
                    const tmpIssue = new Issue("#" + id + " - " + title, id, body, state, assignee, "Frontend", vscode.TreeItemCollapsibleState.None);
                    const issueForList = new Issue(tmpIssue.label, tmpIssue.issueId, tmpIssue.body, tmpIssue.issueState,
                        tmpIssue.assignee, tmpIssue.firstlabel, tmpIssue.collapsibleState, {
                            command: 'giteaIssues.openIssue',
                            title: '',
                            arguments: [tmpIssue],
                        });
                    this.issueList.push(issueForList);
                }
            }).catch(err => {
                console.log(err);
                stop = true;
                vscode.window.showErrorMessage("Can't fetch issues; HTTP Error!");
                return;
            });
            if (stop) {
                return;
            }
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