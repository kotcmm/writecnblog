import * as vscode from 'vscode';
import { BlogPostItem } from '../blog/blog-post-provider';
import { pushPost } from './savePost';

export function publishPostActivate(context: vscode.ExtensionContext) {

    let publishPostDisposable = vscode.commands.registerCommand('writeCnblog.publishPost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                try {
                    await pushPost(blogPostItem.postBaseInfo.id, true);
                    vscode.window.showInformationMessage("发布文章成功");
                } catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        });

    context.subscriptions.push(publishPostDisposable);
}
