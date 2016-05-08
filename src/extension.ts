'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {Metaweblog}  from './metaweblog'
import {CnblogPickItem} from './CnblogPickItem'
import {ImageToBase64} from './ImageToBase64'
import {FileController} from './FileController'


export function activate(context: vscode.ExtensionContext) {

    let newPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.newPost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            newPost(blogConfig.config, blogConfig.metaweblog, true);
        });
    });

    let savePostDisposable = vscode.commands.registerCommand('extension.writeCnblog.savePost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            newPost(blogConfig.config, blogConfig.metaweblog, false);
        });
    });

    let editNewPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.editNewPost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            editPost(blogConfig.config, blogConfig.metaweblog, true);
        });
    });

    let editSavePostDisposable = vscode.commands.registerCommand('extension.writeCnblog.editSavePost', () => {
        getBlogConfig(function initConfig(blogConfig) {
            editPost(blogConfig.config, blogConfig.metaweblog, false);
        });
    });

    let recentPostsDisposable = vscode.commands.registerCommand('extension.writeCnblog.recentPosts', () => {
        getBlogConfig(function initConfig(blogConfig) {
            getRecentPosts(blogConfig.config, blogConfig.metaweblog);
        });
    });

    let newMediaObjectDisposable = vscode.commands.registerCommand('extension.writeCnblog.newMediaObject', () => {
        let edit = vscode.window.activeTextEditor;
        if (!edit) {
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
    context.subscriptions.push(editNewPostDisposable);
    context.subscriptions.push(editSavePostDisposable);
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
        let title = titleName(textEditor.document.fileName);
        updateCheck(title).then(() => {
            let post = {
                title: title,
                description: textEditor.document.getText(),
                categories: ["[Markdown]"]
            };
            metaweblog.newPos(config.blogid, config.name, config.password, post, publish, callBakc);
        });

    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

function editPost(config, metaweblog: Metaweblog, publish: boolean) {
    let textEditor = vscode.window.activeTextEditor;
    if (textEditor) {
        let title = titleName(textEditor.document.fileName);
        let postid = getPostId(title);

        if (!postid) {
            vscode.window.showErrorMessage("没有可以更新的postid");
            return;
        }

        let post = {
            title: titleWithoutPostId(title),
            description: textEditor.document.getText(),
            categories: ["[Markdown]"]
        };
        metaweblog.editPos(postid, config.name, config.password, post, publish, callBakc);
    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

function callBakc(err, method, backData) {

    if (backData.faultCode) {
        vscode.window.showErrorMessage(backData.faultString);
        return;
    }
    let File = new FileController();

    switch (method) {
        case "metaWeblog.getRecentPosts":
            var blogTitle = [];
            for (var i = 0; backData.length > i; i++) {
                var blog = backData[i];
                blogTitle.push(new CnblogPickItem(blog.title, blog.postid));
            }
            var pick = vscode.window.showQuickPick(blogTitle);

            pick.then(function name(params: CnblogPickItem) {
                if (!params) return;

                if (_blogConfig) {
                    let blogConfig = _blogConfig;
                    blogConfig.metaweblog.getPost(params.detail, blogConfig.config.name, blogConfig.config.password, callBakc);
                };
            });
            break;
        case "metaWeblog.newPost":
            vscode.window.showInformationMessage("添加文章成功，文章编号：" + backData);
            let oldPath = vscode.window.activeTextEditor.document.fileName;
            let basename = path.basename(oldPath);
            let newPath = path.join(oldPath, "..", `[${backData}]${basename}`);
            fs.rename(oldPath, newPath);
            File.openFileInEditor(newPath).catch((err) => {
                if (err) {
                    vscode.window.showErrorMessage(err);
                }
            });
            break;
        case "metaWeblog.editPost":
            vscode.window.showInformationMessage("更新文章成功：" + backData);
            break;
        case "metaWeblog.getPost":
            let fileName = `[${backData.postid}]${backData.title}.md`;
            File.determineFullPath(fileName)
                .then(File.createFile)
                .then(File.openFileInEditor)
                .then((textEditor) => {
                    textEditor.edit(function editDocument(editParams) {
                        editParams.insert(vscode.window.activeTextEditor.selection.active, backData.description);
                    });
                })
                .catch((err) => {
                    if (err) {
                        vscode.window.showErrorMessage(err);
                    }
                });
            break;
        default:
            break;
    }

}

function titleWithoutPostId(titleName: string): string {
    return titleName.replace(/\[\d+]/, "");
}

function getPostId(titleName: string): string {
    let idMatch = titleName.match(/\[\d+]/);
    return idMatch ? idMatch[0].replace("[", "").replace("]", "") : null;
}

function titleName(fileName: string): string {
    return path.parse(fileName).name;
}

function updateCheck(titleName) {
    return new Promise((resolve, reject) => {

        let idMatch = titleName.match(/\[\d+]/);
        if (!idMatch) {
            return resolve();
        }

        const options: vscode.QuickPickOptions = {
            matchOnDescription: true,
            placeHolder: "可能包含有更新信息，是否要继续发布?"
        };

        const choices: vscode.QuickPickItem[] = [
            { label: 'Yes', description: '继续发布.' },
            { label: 'No', description: '取消.' }
        ];

        vscode.window.showQuickPick(choices, options).then((choice) => {
            if (!choice) {
                return reject(null);
            }

            if (choice.label === 'Yes') {
                return resolve();
            }
        });
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

let _blogConfig = undefined;