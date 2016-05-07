'use strict';

import * as vscode from 'vscode';
import {Metaweblog}  from './metaweblog'
import {CnbolgPickItem} from './cnbolgPickItem'
import {ImageToBase64} from './ImageToBase64'


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
        let edit = vscode.window.activeTextEditor;
        if(!edit){
            vscode.window.showErrorMessage("没有打开编辑窗口");
        }
       
        let imageUrl = vscode.window.showInputBox({ prompt: "输入要上传图片路径" }).then(
            function url(imageUrl) {
                if (imageUrl) {
                    var imagetobase64 = new ImageToBase64();
                    imagetobase64.convertFile(imageUrl).then(function (fileinfo) {
                        if (fileinfo) {
                            getBlogConfig(function initConfig(blogConfig) {
                                newMediaObject(blogConfig.config, blogConfig.metaweblog, edit, fileinfo);
                            });
                        }
                    }, function reject(params) {
                        vscode.window.showErrorMessage(params);
                    });

                } else {
                    vscode.window.showErrorMessage("没有选择要上传图片的地址");
                }
            }
        );
    });

    context.subscriptions.push(newPostDisposable);
    context.subscriptions.push(savePostDisposable);
    context.subscriptions.push(recentPostsDisposable);
    context.subscriptions.push(newMediaObjectDisposable);
}

function getBlogConfig(callBakc) {
    
    if (_blogConfig && callBakc) {
        callBakc(_blogConfig);
        return;
    };
    
    let blogNameResult = vscode.window.showInputBox({ prompt: "输入Blog地址名" });
    blogNameResult.then(function blogNameInputThen(blogNameParams) {

        if (blogNameParams == undefined) return;

        let apiUrl = "http://rpc.cnblogs.com/metaweblog/" + blogNameParams;
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
                    _blogConfig = blogConfig;
                    
                    if (callBakc) callBakc(blogConfig);
                });
            });
        });
    });
}

function getRecentPosts(config, metaweblog: Metaweblog) {
    metaweblog.getRecentPosts(config.blogid, config.name, config.password, 10, callBakc);
}

function newMediaObject(config, metaweblog: Metaweblog, edit, file) {
console.log(file);
    metaweblog.newMediaObject(config.blogid, config.name, config.password, file, function name(err, method, backData) {
        if (backData.faultCode) {
            vscode.window.showErrorMessage(backData.faultString);
            return;
        }
        var url = `![](${backData.url})`;
        edit.edit(function editDocument(editParams) {
            editParams.insert(edit.selection.active, url);
        });
    });
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

                if (_blogConfig) {
                    let blogConfig = _blogConfig;
                    blogConfig.metaweblog.getPost(params.detail, blogConfig.config.name, blogConfig.config.password, callBakc);
                };
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
    fileName = fileName.replace(/\//g,"\\");
    return fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.lastIndexOf('.'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}

let _blogConfig = undefined;