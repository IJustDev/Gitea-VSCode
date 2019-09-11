import axios from 'axios';
import * as vscode from 'vscode';

import { Config } from './Config';
import { Issue } from './issue';

const marked = require('marked');

async function fetchFromRepository(options: {
    repoUri: string,
    state: "open" | "closed",
    page: number,
    token: string,
}): Promise<Issue[]> {
    const {repoUri, state, page, token} = options;
    const list: Issue[] = [];
    console.log(page);
    return axios
        .get(repoUri + `?state=${state}&page=${page}`, { headers: { Authorization: 'token ' + token } })
        .then((res) => {
            const data = res.data;
            if (data.length === 0) {
                return [];
            }
            data.forEach((element: any) => {
                list.push(parseToIssue(element));
            });
            return list;
        })
        .catch((err) => {
            throw err;
        });
}

export async function fetchIssues(state: "open" | "closed"): Promise<Issue[]>{
    const issueList: Issue[] = [] as any;
    const config = new Config();
    const repoUri = config.repoApiUrl;
    const token = config.token;
    for (let page = 1; page !== 3; page++) {
        const issues = await fetchFromRepository({
            page,
            repoUri,
            token,
            state
        });
        issues.forEach(issue => {
            issueList.push(issue);
        });
    }
    return issueList;
}

export function parseToIssue(data: any, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed): Issue {
    const id = data['number'];
    const title = data['title'];
    const body = marked(data['body']);
    const state = data['state'];
    const assignee = data['assignee'] === null ? 'None' : data['assignee']['username'];
    const labels = data['labels'];
    const creator = data['user']['username'];
    const issue = new Issue('#' + id + ' - ' + title, id, body, state, assignee, creator, labels, collapsibleState, {
        command: 'giteaIssues.openIssue',
        title: ''
    });
    // ((issue.command) as vscode.Command).arguments = [issue];
    return issue;
}