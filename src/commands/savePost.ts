import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { BlogPostItem } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function savePostActivate(context: vscode.ExtensionContext) {

    let savePostDisposable = vscode.commands.registerCommand('writeCnblog.savePost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                let post = blogFile.getPost(blogPostItem.postBaseInfo);
                if (post) {
                    if (post.postid) {
                        await blogOperate.editPost(post, false);
                    } else {
                        await blogOperate.newPos(post, false);
                    }
                    vscode.window.showInformationMessage("保存草稿成功");
                } else {
                    vscode.window.showErrorMessage("要保存的文章不存在");
                }
            }
        });

    context.subscriptions.push(savePostDisposable);
}
