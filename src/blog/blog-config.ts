import * as vscode from 'vscode';

export let AppKey: string = "cnblogWriteVsCode";

export class BlogConfig {

    /**
     * 获取根配置
     */
    private get config(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('writeCnblog');
    }

    get userName(): string {
        let userName = this.config.get<string>('userName');
        if (!userName) {
            throw new Error("在配置中配置:writeCnblog.userName");
        }
        return userName;
    }

    get passWord(): string {
        let passWord = this.config.get<string>('passWord');
        if (!passWord) {
            throw new Error("在配置中配置:writeCnblog.passWord");
        }
        return passWord;
    }

    get rpcUrl(): string {
        let rpcUrl = this.config.get<string>('rpcUrl');
        if (!rpcUrl) {
            throw new Error("在配置中配置:writeCnblog.rpcUrl");
        }
        return rpcUrl;
    }
}