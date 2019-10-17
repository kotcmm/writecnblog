import * as vscode from 'vscode';
import { blogPostProvider } from '../blog/blog-post-provider';

export function refreshActivate(context: vscode.ExtensionContext) {

    let refreshDisposable = vscode.commands.registerCommand('writeCnblog.refresh',
        () => {
            blogPostProvider.refresh();
        });

    context.subscriptions.push(refreshDisposable);
}
