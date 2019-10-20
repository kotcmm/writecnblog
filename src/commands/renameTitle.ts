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
                            let oldFilePath = blogPostItem.postBaseInfo.fsPath;
                            let newFilePath = blogFile.renameTitle(blogPostItem.postBaseInfo, title);
                            let textEditor = vscode.window.visibleTextEditors
                                .find(t => t.document.fileName === oldFilePath);
                            if (textEditor && newFilePath) {
                                let viewColumn = textEditor.viewColumn;
                                textEditor.hide();
                                vscode.window.showTextDocument(
                                    vscode.Uri.file(newFilePath),
                                    { viewColumn: viewColumn });
                            }
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
