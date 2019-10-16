import * as vscode from 'vscode';
// import { blogOperate } from '../blog/blog-operate';

export function newPostActivate(context: vscode.ExtensionContext) {

    let newPostDisposable = vscode.commands.registerCommand('writeCnblog.newPost', async () => {
        // blogOperate.newPos(true);
    });

    context.subscriptions.push(newPostDisposable);
}
