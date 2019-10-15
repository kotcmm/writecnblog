import * as vscode from 'vscode';
import { BlogPostItem } from '../blog/blog-post-provider';

export function diffPostActivate(context: vscode.ExtensionContext) {

    let diffPostDisposable = vscode.commands.registerCommand('writeCnblog.diffPost', async (blogPostItem: BlogPostItem) => {
        let postBaseInfo = blogPostItem.postBaseInfo;
        if (postBaseInfo && postBaseInfo.fsPath && postBaseInfo.remotePath) {
            let title = `远端：${postBaseInfo.remoteTitle}<--->本地：${postBaseInfo.title}`;
            await vscode.commands.executeCommand('vscode.diff',
                vscode.Uri.file(postBaseInfo.remotePath),
                vscode.Uri.file(postBaseInfo.fsPath),
                title,
                { preview: true });
        }

    });

    context.subscriptions.push(diffPostDisposable);
}
