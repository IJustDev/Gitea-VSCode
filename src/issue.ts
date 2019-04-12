import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

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
        try {
            for (const issueLabel of labels) {
                const folderPath = path.join(vscode.workspace.rootPath as string, '.gitea', 'label_pictures');
                if (!fs.existsSync(path.join(folderPath, issueLabel.name + ".svg"))) {
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath);
                    }
                    fs.writeFileSync(path.join(folderPath, issueLabel.name + ".svg"), createIconWithColor(issueLabel.color));
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    get tooltip() {
        return this.label + " - " + this.assignee;
    }

    labelDependentIcon(dark: boolean = false): string {
        let filename = "";
        if (this.labels.length === 0) {
            filename = "issue";
            return path.join(__filename, '..', '..', 'media', 'issue.svg');
        } else {
            filename = this.labels[0].name;
            return path.join(vscode.workspace.rootPath as string, '.gitea', 'label_pictures', this.labels[0].name + ".svg");
        }
    }

    iconPath = {
        light: this.labelDependentIcon(),
        dark: this.labelDependentIcon(true)
    };

    contextValue = 'issue';
}

export function createIconWithColor(color: string) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 31.5C24.5604 31.5 31.5 24.5604 31.5 16C31.5 7.43959 24.5604 0.5 16 0.5C7.43959 0.5 0.5 7.43959 0.5 16C0.5 24.5604 7.43959 31.5 16 31.5Z" stroke="{{color}}"/>
<path d="M19 6C19 4.34315 17.6569 3 16 3C14.3431 3 13 4.34315 13 6V20C13 21.6569 14.3431 23 16 23C17.6569 23 19 21.6569 19 20V6Z" fill="{{color}}"/>
<path d="M16.5 24H15.5C14.1193 24 13 25.1193 13 26.5C13 27.8807 14.1193 29 15.5 29H16.5C17.8807 29 19 27.8807 19 26.5C19 25.1193 17.8807 24 16.5 24Z" fill="{{color}}"/>
</svg>
`.replace(new RegExp("{{color}}", 'g'), "#" + color);
}