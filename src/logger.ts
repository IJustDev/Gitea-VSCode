import { type } from "os";
import { OutputChannel, window } from "vscode";

// Inspiration : GitLens - https://github.com/gitkraken/vscode-gitlens/blob/main/src/logger.ts
export class Logger {
    private static channel: OutputChannel | undefined

    private constructor() { }

    public static init() {
        this.channel = window.createOutputChannel('Gitea')
    }

    public static log(message: string): void {
        if (this.channel == null) return
        this.channel.appendLine(`${this.timestamp} ${message}`);
    }

    public static debug(message: string, ...params: any[]): void {
        if (this.channel == null) return

        params = this.convertParams(params)
        this.channel.appendLine(`${this.timestamp}[DEBUG] ${message} - ${params.join(' - ')}`);
    }

    private static convertParams(params: any[]): any[] {
        return params.flatMap((param: any) => {
            if (typeof param === 'object') {
                return Object.entries(param).map((entry) => {
                    return entry[0] + ': ' + entry[1];
                });
            }
            return param;
        });
    }

    private static get timestamp(): string {
        return `[${new Date().toISOString().replace(/.*T/, '').slice(0, -1)}]`;
    }
}
