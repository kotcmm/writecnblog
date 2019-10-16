import * as vscode from 'vscode';
import { blogPostProvider } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function createPostActivate(context: vscode.ExtensionContext) {

    let createPostDisposable = vscode.commands.registerCommand('writeCnblog.createPost',
        () => {
            vscode.window.showInputBox().then(title => {
                if (title) {
                    try {
                        blogFile.createPost(title);
                        blogPostProvider.refresh();
                    } catch (error) {
                        vscode.window.showErrorMessage(error.message);
                    }
                }
            });
        });

    context.subscriptions.push(createPostDisposable);
}
