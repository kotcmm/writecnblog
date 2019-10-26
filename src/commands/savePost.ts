import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { BlogPostItem, blogPostProvider } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function savePostActivate(context: vscode.ExtensionContext) {

    let savePostDisposable = vscode.commands.registerCommand('writeCnblog.savePost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                try {
                    await pushPost(blogPostItem.postBaseInfo.id, false);
                    vscode.window.showInformationMessage("保存草稿成功");
                } catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        });

    context.subscriptions.push(savePostDisposable);
}

export async function pushPost(id: number, publish: Boolean) {
    let post = await blogFile.getPost(id);

    if (post.postid) {
        await blogOperate.editPost(post, publish);
    }
    else {
        let postId = await blogOperate.newPos(post, publish);
        blogFile.updatePostId(postId, id);
        post.postid = postId;
    }

    let updatePost = await blogOperate.getPost(post.postid);
    await blogFile.pullPost(updatePost);
    blogPostProvider.refresh();
}
