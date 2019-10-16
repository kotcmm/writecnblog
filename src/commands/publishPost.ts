import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { BlogPostItem } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function publishPostActivate(context: vscode.ExtensionContext) {

    let publishPostDisposable = vscode.commands.registerCommand('writeCnblog.publishPost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                let post = blogFile.getPost(blogPostItem.postBaseInfo);
                if (post) {
                    if (post.postid) {
                        await blogOperate.editPost(post, true);
                    } else {
                        await blogOperate.newPos(post, true);
                    }
                    vscode.window.showInformationMessage("发布文章成功");
                } else {
                    vscode.window.showErrorMessage("发布的文章不存在");
                }
            }
        });

    context.subscriptions.push(publishPostDisposable);
}
