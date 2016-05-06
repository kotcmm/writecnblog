'use strict';

import * as vscode from 'vscode';
import {Metaweblog}  from './metaweblog'
import {CnbolgPickItem} from './cnbolgPickItem'


export function activate(context: vscode.ExtensionContext) {

    let newPostDisposable = vscode.commands.registerCommand('extension.writeCnbolg.newPost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            newPost(blogConfig.config, blogConfig.metaweblog, true);
        });
    });

    let savePostDisposable = vscode.commands.registerCommand('extension.writeCnbolg.savePost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            newPost(blogConfig.config, blogConfig.metaweblog, false);
        });
    });

    let recentPostsDisposable = vscode.commands.registerCommand('extension.writeCnbolg.recentPosts', () => {
        getBlogConfig(function initConfig(blogConfig) {
            getRecentPosts(blogConfig.config, blogConfig.metaweblog);
        });
    });

    let newMediaObjectDisposable = vscode.commands.registerCommand('extension.writeCnbolg.newMediaObject', () => {

    });

    context.subscriptions.push(newPostDisposable);
    context.subscriptions.push(savePostDisposable);
    context.subscriptions.push(recentPostsDisposable);
    context.subscriptions.push(newMediaObjectDisposable);
}

function getBlogConfig(callBakc) {
    let blogNameResult = vscode.window.showInputBox({ prompt: "输入Blog地址名" });
    blogNameResult.then(function blogNameInputThen(blogNameParams) {
        
        if (blogNameParams == undefined) return;
        
        let apiUrl = "http://www.cnblogs.com/"+blogNameParams+"/services/metablogapi.aspx";
        let nameResult = vscode.window.showInputBox({ prompt: "输入用户名" });
        nameResult.then(function nameInputThen(nameParams) {

            if (nameParams == undefined) return;

            let name = nameParams;
            let passwordResult = vscode.window.showInputBox({ prompt: "输入密码", password: true });
            passwordResult.then(function passwordInputThen(passwordParams) {

                if (passwordParams == undefined) return;

                let password = passwordParams;
                let metaweblog = new Metaweblog(apiUrl);
                metaweblog.getUsersBlogs("cnblogWriteVsCode", name, password, function getUsersBlogsCallBakc(err, method, backData) {

                    if (backData.faultCode) {
                        vscode.window.showErrorMessage(backData.faultString);
                        return;
                    }
                    let blogConfig = {};
                    blogConfig["config"] = {
                        apiUrl: apiUrl,
                        blogid: backData[0].blogid,
                        name: name,
                        password: password
                    };
                    blogConfig["metaweblog"] = metaweblog;
                    
                    if(callBakc) callBakc(blogConfig);
                });
            });
        });
    });
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

                // let blogConfig = getBlogConfig();
                // blogConfig.metaweblog.getPost(params.detail, blogConfig.config.name, blogConfig.config.password, callBakc);
            });
            break;
        case "metaWeblog.newPost":
            vscode.window.showInformationMessage("添加文章成功，文章编号：" + backData);
            break;

        case "metaWeblog.getPost":
            var uri = vscode.Uri.parse("untitled:" + vscode.workspace.rootPath + "\\" + backData.title + ".md");
            var document = vscode.workspace.openTextDocument(uri);
            document.then(function insertDocument(getPostDocument) {
                var editText = vscode.window.showTextDocument(getPostDocument);
                editText.then(function textEditor(activeTextEditor) {
                    activeTextEditor.edit(function editDocument(editParams) {
                        editParams.insert(vscode.window.activeTextEditor.selection.active, backData.description);
                    });
                });

            })
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