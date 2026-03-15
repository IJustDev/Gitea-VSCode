import * as vscode from 'vscode';
import * as https from 'https';
import axios from 'axios';

import { IGiteaResponse } from './IGiteaResponse';
import { Logger } from './logger';
import { Config } from './config';

export class GiteaConnector {
    private authToken: string;
    private ssl: boolean;

    public constructor(authToken: string, ssl: boolean = false) {
        this.authToken = authToken;
        this.ssl = ssl;
    }

    public async getIssues(repoUri: string, state: string, page: number = 0): Promise<IGiteaResponse> {
        const config = new Config();
        return config.havingCertificateIssueOnLocalServer ?
        this.getEndpoint2(`${repoUri}?state=${state}&page=${page}`):
        this.getEndpoint(`${repoUri}?state=${state}&page=${page}`);
    }

    /// Using AXIOS
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

    /// Using https library because of self-signed certificates issue  in axios, this issue was occurring  when using axios with local gitea server running on docker
    private async getEndpoint2(endPointPath: string): Promise<IGiteaResponse> {
        const config = new Config();
        Logger.debug('getEndpoint', 'request', { 'url': endPointPath });

        return new Promise<IGiteaResponse>(async (resolve, reject) => {
            const responseData: Buffer[] = []; // Initialize as an empty array

            const req = https.request(this.requestOptions2(endPointPath), (res) => {
                res.on('data', (chunk) => {
                    responseData.push(chunk); // Push each chunk to the array
                });

                res.on('end', () => {
                    const responseDataString = Buffer.concat(responseData).toString(); // Join chunks into a single string
                    const response: IGiteaResponse = { data: JSON.parse(responseDataString) }; // Parse the JSON data
                    resolve(response);
                    Logger.debug('getEndpoint', 'response', { 'url': config.host+ ':' + config.port + endPointPath, 'status': res.statusCode,'size': response.data.length });
                });
            }).on('error', (err) => {
                this.displayErrorMessage(err.message);
                Logger.log(err.message);
                reject(err);
            });

            req.end();
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

    /// Returns alternative request options for [getEndpoint2] method written above
    private requestOptions2(endPointPath:string): object {
        const config = new Config();
        return {
            method: 'GET',
            hostname: config.host,
            port: config.port,
            path: endPointPath,
            
            rejectUnauthorized: this.ssl,
            headers: {
                Authorization: 'token ' + this.authToken,
                Accept: 'application/json;charset=utf-8'
            },
        };
    }
    private displayErrorMessage(err: string) {
        vscode.window.showErrorMessage("Error occoured. " + err);
    }
}
