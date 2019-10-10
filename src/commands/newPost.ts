import * as vscode from 'vscode';
import { MetaweblogApi } from '../blog/metaweblog-api';

export function newPostActivate(context: vscode.ExtensionContext){
    
    let newPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.newPost', async () => {
        let blogApi = new MetaweblogApi();
        blogApi.newPos(true);
    });

    context.subscriptions.push(newPostDisposable);
}
