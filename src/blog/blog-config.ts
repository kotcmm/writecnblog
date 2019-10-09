import * as vscode from 'vscode';

export let AppKey: string = "cnblogWriteVsCode";

export class BlogConfig {

    /**
     * 获取根配置
     */
    private get config(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('writeCnblog');
    }

    get blogName(): String {
        let blogName = this.config.get<String>('blogName');
        if (!blogName) {
            throw new Error("在配置中配置:writeCnblog.blogName");
        }
        return blogName;
    }

    get userName(): String {
        let userName = this.config.get<String>('userName');
        if (!userName) {
            throw new Error("在配置中配置:writeCnblog.userName");
        }
        return userName;
    }

    get passWord(): String {
        let passWord = this.config.get<String>('passWord');
        if (!passWord) {
            throw new Error("在配置中配置:writeCnblog.passWord");
        }
        return passWord;
    }

    get rpcUrl(): String {
        let rpcUrl = this.config.get<String>('rpcUrl');
        if (!rpcUrl) {
            throw new Error("在配置中配置:writeCnblog.rpcUrl");
        }
        return rpcUrl;
    }
}