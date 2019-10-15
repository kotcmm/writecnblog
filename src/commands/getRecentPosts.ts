import * as vscode from 'vscode';
import { BlogPostProvider } from '../blog/blog-post-provider';

export function getRecentPostsActivate(context: vscode.ExtensionContext) {

    let treeDataProvider = new BlogPostProvider(context);
    vscode.window.createTreeView('blogPostExplorer', { treeDataProvider });

    let getRecentPostsDisposable = vscode.commands.registerCommand('writeCnblog.getRecentPosts',
        () => {
            treeDataProvider.refresh();
        });

    context.subscriptions.push(getRecentPostsDisposable);
}
