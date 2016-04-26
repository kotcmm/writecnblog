'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Metaweblog}  from './metaweblog'
import {CnbolgPickItem} from './cnbolgPickItem'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "writecnbolg" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.writeCnbolg', () => {
        // The code you place here will be executed every time your command is executed
        if(!vscode.workspace.rootPath){
            vscode.window.showInformationMessage("需要打开文件夹并创建工作区设置");
            return;
        }
       
        let configuration = vscode.workspace.getConfiguration('cnblog.confing');
        let config = {
            apiUrl:configuration.get("apiUrl"),
            blogid:configuration.get("blogid"),
            name:configuration.get("name"),
            password:configuration.get("password")
        };
        let metaweblog = new Metaweblog(configuration.get<string>("apiUrl"));
        
        let pick = vscode.window.showQuickPick(new Array(
            new CnbolgPickItem("发布博文", "newPost"),
            new CnbolgPickItem("保存草稿", "savePost"),
            new CnbolgPickItem("获取文章","recentPosts"),
            new CnbolgPickItem("帮助","help")));
                                
        pick.then(function name(params:CnbolgPickItem) {
            if(!params) return;
            
            switch (params.detail) {
                case "newPost":
                      pullPost(config,metaweblog,true);            
                    break;
                case "savePost":
                      pullPost(config,metaweblog,false); 
                    break;
                case "recentPosts":
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

function pullPost(config,metaweblog: Metaweblog, publish: boolean) {
    let textEditor = vscode.window.activeTextEditor;
    if (textEditor) {
        let post = {
            title: textEditor.document.fileName,
            description: textEditor.document.getText()
        };
        metaweblog.newPos(config.blogid, config.name, config.password, post, publish);
    } else {
        vscode.window.showErrorMessage("没有打开要发布的文章！");
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}