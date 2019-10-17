import * as vscode from 'vscode';
import { blogPostProvider, BlogPostItem } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function renameTitleActivate(context: vscode.ExtensionContext) {

    let renameTitleDisposable = vscode.commands.registerCommand('writeCnblog.renameTitle',
        (blogPostItem: BlogPostItem) => {
            vscode.window.showInputBox({ value: blogPostItem.postBaseInfo!.title }).then(title => {
                if (title) {
                    try {
                        if (blogPostItem.postBaseInfo && title) {
                            blogFile.renameTitle(blogPostItem.postBaseInfo, title);
                            blogPostProvider.refresh();
                        }
                    } catch (error) {
                        vscode.window.showErrorMessage(error.message);
                    }
                }
            });

        });

    context.subscriptions.push(renameTitleDisposable);
}
