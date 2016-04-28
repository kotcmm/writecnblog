'use strict';

import * as vscode from 'vscode';
import {Metaweblog}  from './metaweblog'
import {CnbolgPickItem} from './cnbolgPickItem'


export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.writeCnbolg', () => {

        if (!vscode.workspace.rootPath) {
            vscode.window.showInformationMessage("需要打开文件夹并创建工作区设置");
            return;
        }

        let blogConfig = getBlogConfig();

        let pick = vscode.window.showQuickPick(new Array(
            new CnbolgPickItem("发布博文", "newPost"),
            new CnbolgPickItem("保存草稿", "savePost"),
            new CnbolgPickItem("获取文章", "recentPosts"),
            new CnbolgPickItem("帮助", "help")));

        pick.then(function name(params: CnbolgPickItem) {
            if (!params) return;

            switch (params.detail) {
                case "newPost":
                    newPost(blogConfig.config, blogConfig.metaweblog, true);
                    break;
                case "savePost":
                    newPost(blogConfig.config, blogConfig.metaweblog, false);
                    break;
                case "recentPosts":
                    getRecentPosts(blogConfig.config, blogConfig.metaweblog);
                    break;
                case "help":

                    break;
                default:
                    break;
            }
        });

    });

    context.subscriptions.push(disposable);
}

function getBlogConfig():any {
    let blogConfig = {};
    let configuration = vscode.workspace.getConfiguration('cnblog.confing');
    blogConfig["config"] = {
        apiUrl: configuration.get("apiUrl"),
        blogid: configuration.get("blogid"),
        name: configuration.get("name"),
        password: configuration.get("password")
    };
    blogConfig["metaweblog"] = new Metaweblog(configuration.get<string>("apiUrl"));
    return blogConfig;
}

function getRecentPosts(config, metaweblog: Metaweblog) {
    metaweblog.getRecentPosts(config.blogid, config.name, config.password, 10, callBakc);
}

function newPost(config, metaweblog: Metaweblog, publish: boolean) {
    let textEditor = vscode.window.activeTextEditor;
    if (textEditor) {
        let post = {
            title: titleName(textEditor.document.fileName),
            description: textEditor.document.getText(),
            categories: ["[Markdown]"]
        };
        metaweblog.newPos(config.blogid, config.name, config.password, post, publish, callBakc);
    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

function callBakc(err, method, backData) {

    if (backData.faultCode) {
        vscode.window.showErrorMessage(backData.faultString);
        return;
    }

    switch (method) {
        case "metaWeblog.getRecentPosts":
            var bolgTitle = [];
            for (var i = 0; backData.length > i; i++) {
                var bolg = backData[i];
                bolgTitle.push(new CnbolgPickItem(bolg.title, bolg.postid));
            }
            var pick = vscode.window.showQuickPick(bolgTitle);

            pick.then(function name(params: CnbolgPickItem) {
                if (!params) return;
                
                let blogConfig = getBlogConfig();
                blogConfig.metaweblog.getPost(params.detail,blogConfig.config.name, blogConfig.config.password, callBakc);
            });
            break;
        case "metaWeblog.newPost":
            vscode.window.showInformationMessage("添加文章成功，文章编号："+backData);
            break;

        case "metaWeblog.getPost":
            console.log(backData);
            break;
        default:
            break;
    }

}

function titleName(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.lastIndexOf('.'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}