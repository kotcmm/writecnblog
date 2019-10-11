import * as vscode from 'vscode';
import { BlogOperate } from '../blog/blog-operate';

export function newPostActivate(context: vscode.ExtensionContext) {
    let recentPostsDisposable = vscode.commands.registerCommand('extension.writeCnblog.recentPosts', async () => {
        let blogOperate = new BlogOperate();
        blogOperate.getRecentPosts(40);
    });

    context.subscriptions.push(recentPostsDisposable);
}
