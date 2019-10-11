import * as vscode from 'vscode';
import { BlogOperate } from '../blog/blog-operate';

export function newPostActivate(context: vscode.ExtensionContext) {

    let newPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.newPost', async () => {
        let blogOperate = new BlogOperate();
        blogOperate.newPos(true);
    });

    context.subscriptions.push(newPostDisposable);
}
