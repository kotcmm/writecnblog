import * as vscode from 'vscode';
import { BlogPostItem } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';
import { pushPost } from './savePost';

export function publishPostActivate(context: vscode.ExtensionContext) {

    let publishPostDisposable = vscode.commands.registerCommand('writeCnblog.publishPost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                let post = blogFile.getPost(blogPostItem.postBaseInfo);
                if (post) {
                    await pushPost(post, true);
                    vscode.window.showInformationMessage("发布文章成功");
                } else {
                    vscode.window.showErrorMessage("发布的文章不存在");
                }
            }
        });

    context.subscriptions.push(publishPostDisposable);
}
