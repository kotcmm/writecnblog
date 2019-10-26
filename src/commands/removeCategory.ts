import * as vscode from 'vscode';
import { BlogPostItem, blogPostProvider } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function removeCategoryActivate(context: vscode.ExtensionContext) {

    let removeCategoryDisposable = vscode.commands.registerCommand('writeCnblog.removeCategory',
        (blogPostItem: BlogPostItem) => {
            let id = blogPostItem.postBaseInfo!.id;
            if (id && blogPostItem.label) {
                try {
                    blogFile.removeCategory(id, blogPostItem.label);
                    vscode.window.showInformationMessage("移除成功");
                    blogPostProvider.refresh();
                } catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        });

    context.subscriptions.push(removeCategoryDisposable);
}
