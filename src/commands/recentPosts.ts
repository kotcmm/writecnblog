import * as vscode from 'vscode';
import { MetaweblogApi } from '../blog/metaweblog-api';

export function newPostActivate(context: vscode.ExtensionContext) {
    let recentPostsDisposable = vscode.commands.registerCommand('extension.writeCnblog.recentPosts', async () => {
        let blogOperate = new MetaweblogApi();
        blogOperate.getRecentPosts(40);
    });

    context.subscriptions.push(recentPostsDisposable);
}
