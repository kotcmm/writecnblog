'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Metaweblog } from './metaweblog';
import { CnblogPickItem } from './CnblogPickItem';
import { ImageToBase64 } from './ImageToBase64';
import { FileController } from './FileController';
import { error } from 'util';
import { spawn } from 'child_process';
import * as moment from 'moment';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "writeCnblog" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let newPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.newPost', () => {
        getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
            newPost(blogConfig.config, blogConfig.metaweblog, true);
        });
    });

    let savePostDisposable = vscode.commands.registerCommand('extension.savePost', () => {
        getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
            newPost(blogConfig.config, blogConfig.metaweblog, false);
        });
    });

    let editNewPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.editNewPost', () => {
        getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
            editPost(blogConfig.config, blogConfig.metaweblog, true);
        });
    });

    let editSavePostDisposable = vscode.commands.registerCommand('extension.writeCnblog.editSavePost', () => {
        getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
            editPost(blogConfig.config, blogConfig.metaweblog, false);
        });
    });

    let recentPostsDisposable = vscode.commands.registerCommand('extension.writeCnblog.recentPosts', () => {
        getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
            getRecentPosts(blogConfig.config, blogConfig.metaweblog);
        });
    });

    let newMediaObjectDisposable = vscode.commands.registerCommand('extension.writeCnblog.newMediaObject', () => {
        const edit = vscode.window.activeTextEditor;
        if (!edit) {
            vscode.window.showErrorMessage("没有打开编辑窗口");
            return;
        }
        vscode.window.showOpenDialog({

            filters: { 'Images': ['png', 'jpg', 'gif', 'bmp'] }

        }).then(result => {

            if (result) {
                const { fsPath } = result[0];
                
                //上传图片
                pushImage(fsPath,edit);
            
            }
        }, error);
    });

    let postImageFromClipboardDisposable = vscode.commands.registerCommand('extension.writeCnblog.postImageFromClipboard', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("没有打开编辑窗口");
            return;
        }
        
        let folderPath = path.dirname(editor.document.fileName);
        let ext = path.extname(editor.document.fileName);
        let fileName = path.basename(editor.document.fileName,ext);

        let fileNameWithoutExt = moment().format("YYYYMMDDHHmmss") + ".png";
        let imagePath = path.join(folderPath,"Images",fileName,fileNameWithoutExt);
        
        saveClipboardImageToFileAndGetPath(imagePath, (imagePath, imagePathReturnByScript) => {
            if (!imagePathReturnByScript) { return; }
            if (imagePathReturnByScript === 'no image') {
                vscode.window.showErrorMessage('There is not a image in clipboard.');
                return;
            }
            //上传图片
            pushImage(imagePath,editor);
        });
    });

    context.subscriptions.push(newPostDisposable);
    context.subscriptions.push(savePostDisposable);
    context.subscriptions.push(editNewPostDisposable);
    context.subscriptions.push(editSavePostDisposable);
    context.subscriptions.push(recentPostsDisposable);
    context.subscriptions.push(newMediaObjectDisposable);
    context.subscriptions.push(postImageFromClipboardDisposable);
}


    /**
     * use applescript to save image from clipboard and get file path
     * 这个代码是从 paste image插件拷贝而来，源项目在https://github.com/mushanshitiancai/vscode-paste-image
     * 通过下端代码支持从剪切板直接读取图片数据流保存到本地文件，并上传到博客园。
     */
    function saveClipboardImageToFileAndGetPath(imagePath:string, cb: (imagePath: string, imagePathFromScript: string) => void) {
        if (!imagePath) { return; }

        let platform = process.platform;
        if (platform === 'win32') {
            // Windows
            const scriptPath = path.join(__dirname, '../res/pc.ps1');

            let command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
            let powershellExisted = fs.existsSync(command);
            if (!powershellExisted) {
                command = "powershell";
            }

            const powershell = spawn(command, [
                '-noprofile',
                '-noninteractive',
                '-nologo',
                '-sta',
                '-executionpolicy', 'unrestricted',
                '-windowstyle', 'hidden',
                '-file', scriptPath,
                imagePath
            ]);
            powershell.on('error', function (e :Error) {
                if (e.message === "ENOENT") {
                    vscode.window.showErrorMessage(`The powershell command is not in you PATH environment variables.Please add it and retry.`);
                } else {               
                    vscode.window.showErrorMessage(e.message + e.stack);
                }
            });
            powershell.on('exit', function (code, signal) {
                // console.log('exit', code, signal);
            });
            powershell.stdout.on('data', function (data: Buffer) {
                cb(imagePath, data.toString().trim());
            });
        }
        else if (platform === 'darwin') {
            // Mac
            let scriptPath = path.join(__dirname, '../res/mac.applescript');

            let ascript = spawn('osascript', [scriptPath, imagePath]);
            ascript.on('error', function (e) {
                vscode.window.showErrorMessage(e.message + e.stack);
            });
            ascript.on('exit', function (code, signal) {
                // console.log('exit',code,signal);
            });
            ascript.stdout.on('data', function (data: Buffer) {
                cb(imagePath, data.toString().trim());
            });
        } else {
            // Linux 

            let scriptPath = path.join(__dirname, '../res/linux.sh');

            let ascript = spawn('sh', [scriptPath, imagePath]);
            ascript.on('error', function (e) {
                vscode.window.showErrorMessage(e.message + e.stack);
            });
            ascript.on('exit', function (code, signal) {
                // console.log('exit',code,signal);
            });
            ascript.stdout.on('data', function (data: Buffer) {
                let result = data.toString().trim();
                if (result === "no xclip") {
                    vscode.window.showErrorMessage('You need to install xclip command first.');
                    return;
                }
                cb(imagePath, result);
            });
        }
    }


function pushImage(fsPath:string,edit : vscode.TextEditor)
{
    if (fsPath) {
        var imagetobase64 = new ImageToBase64();
        imagetobase64.convertFile(fsPath).then(function (fileinfo ) {
            if (fileinfo) {
                getBlogConfig(function initConfig(blogConfig: { config: any; metaweblog: Metaweblog; }) {
                    newMediaObject(blogConfig.config, blogConfig.metaweblog, edit, fsPath,fileinfo);
                });
            }
        }, function reject(params) {
            vscode.window.showErrorMessage(params);
        });

    } else {
        vscode.window.showErrorMessage("没有选择要上传图片的地址");
    }
}


function getBlogConfig(callBakc: (blogConfig: any) => void) {

    if (_blogConfig && callBakc) {
        callBakc(_blogConfig);
        return;
    }

    let blogName = vscode.workspace.getConfiguration('writeCnblog').get<string>('blogName');
    if(!blogName)
    {        
        vscode.window.showErrorMessage("在配置中配置:writeCnblog.blogName");
        return;
    }
    let userName = vscode.workspace.getConfiguration('writeCnblog').get<string>('userName');
    if(!userName)
    {        
        vscode.window.showErrorMessage("在配置中配置:writeCnblog.userName");
        return;
    }
    let passWord = vscode.workspace.getConfiguration('writeCnblog').get<string>('passWord');
    if(!passWord)
    {        
        vscode.window.showErrorMessage("在配置中配置:writeCnblog.passWord");
        return;
    }
    const apiUrl = "http://rpc.cnblogs.com/metaweblog/"+blogName;
    let metaweblog = new Metaweblog(apiUrl);
    metaweblog.getUsersBlogs("cnblogWriteVsCode", userName, passWord, function getUsersBlogsCallBakc(backData :any) {

        if (backData.faultCode) {
            vscode.window.showErrorMessage(backData.faultString);
            return;
        }
        let blogConfig  :{[key: string]: any}={};
        blogConfig["config"] = {
            apiUrl: apiUrl,
            blogid: backData[0].blogid,
            name: userName,
            password: passWord
        };
        blogConfig["metaweblog"] = metaweblog;
        _blogConfig = blogConfig;

        if (callBakc) { callBakc(blogConfig); }
    });
}

function getRecentPosts(config: any, metaweblog: Metaweblog) {
    metaweblog.getRecentPosts(config.blogid, config.name, config.password, 10, callBack);
}

function newMediaObject(config: any, metaweblog: Metaweblog, edit: vscode.TextEditor,filePath:string, file:{}) {

    metaweblog.newMediaObject(config.blogid, config.name, config.password, file, function name(backData: { faultCode: any; faultString: string; url: any; }) {
        if (backData.faultCode) {
            vscode.window.showErrorMessage(backData.faultString);
            return;
        }
        const fileName =  path.basename(filePath);
        var url = `![${fileName}](${backData.url})`;
        edit.edit(function editDocument(editParams) {
            editParams.insert(edit.selection.active, url);
        });
    });
}

function newPost(config: any, metaweblog: Metaweblog, publish: boolean) {
    let textEditor = vscode.window.activeTextEditor;
    if (textEditor) {
        let title = titleName(textEditor.document.fileName);
        updateCheck(title).then(() => {
            let post = {
                title: title,
                description: textEditor?textEditor.document.getText():"",
                categories: ["[Markdown]"]
            };
            metaweblog.newPos(config.blogid, config.name, config.password, post, publish, callBack);
        });

    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

function editPost(config: any, metaweblog: Metaweblog, publish: boolean) {
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
        metaweblog.editPos(postid, config.name, config.password, post, publish, callBack);
    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

function callBack(method:string, backData: any) {

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

            pick.then(function name(params: CnblogPickItem|undefined) {
                if (!params) { return; }

            });
            break;
        case "metaWeblog.newPost":
            vscode.window.showInformationMessage("添加文章成功，文章编号：" + backData);
            if(vscode.window.activeTextEditor){
            let oldPath = vscode.window.activeTextEditor.document.fileName;
            let basename = path.basename(oldPath);
            let newPath = path.join(oldPath, "..", `[${backData}]${basename}`);
            fs.rename(oldPath, newPath,() => {
                File.openFileInEditor(newPath).catch((err) => {
                    if (err) {
                        vscode.window.showErrorMessage(err);
                    }
                });
             });
        }
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
                        if(vscode.window.activeTextEditor){
                        editParams.insert(vscode.window.activeTextEditor.selection.active, backData.description);
                        }
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
    return idMatch ? idMatch[0].replace("[", "").replace("]", "") : "";
}

function titleName(fileName: string): string {
    return path.parse(fileName).name;
}

function updateCheck(titleName: string) {
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
let _blogConfig: { [key: string]: any; } | undefined = undefined;