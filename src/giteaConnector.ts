import * as vscode from 'vscode';
import * as https from 'https';
import axios from 'axios';

import { IGiteaResponse } from './IGiteaResponse';
import { Logger } from './logger';

export class GiteaConnector {
    private authToken: string;
    private ssl: boolean;

    public constructor(authToken: string, ssl: boolean = false) {
        this.authToken = authToken;
        this.ssl = ssl;
    }

    public async getIssues(repoUri: string, state: string, page: number = 0): Promise<IGiteaResponse> {
        return this.getEndpoint(`${repoUri}?state=${state}&page=${page}`);
    }

    private async getEndpoint(url: string): Promise<IGiteaResponse> {
        Logger.debug('getEndpoint', 'request', {'url': url})
        return new Promise<IGiteaResponse>((resolve, reject) => {
            return axios.get(url, this.requestOptions).then((data) => {
                resolve(data);
                Logger.debug('getEndpoint', 'response', {'url': url, 'status': data.status, 'size': data.data.length})
            }).catch((err) => {
                this.displayErrorMessage(err);
                Logger.log(err)
                reject(err);
            });
        });
    }

    private async postEndpoint(url: string): Promise<IGiteaResponse> {
        return new Promise<IGiteaResponse>((resolve, reject) => {
            return axios.post(url, this.requestOptions);
        });
    }

    private get requestOptions(): object {
        const agent = new https.Agent({
            rejectUnauthorized: this.ssl,
        });
        return {
            headers: {Authorization: 'token ' + this.authToken},
            httpsAgent: agent,
        };
    }

    private displayErrorMessage(err: string) {
        vscode.window.showErrorMessage("Error occoured. " + err);
    }
}
