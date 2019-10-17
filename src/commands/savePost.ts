import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { BlogPostItem, blogPostProvider } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';
import { PostStruct } from '../rpc/rpc-package';

export function savePostActivate(context: vscode.ExtensionContext) {

    let savePostDisposable = vscode.commands.registerCommand('writeCnblog.savePost',
        async (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo) {
                let post = blogFile.getPost(blogPostItem.postBaseInfo);
                if (post) {
                    await pushPost(post, false);
                    vscode.window.showInformationMessage("保存草稿成功");
                } else {
                    vscode.window.showErrorMessage("要保存的文章不存在");
                }
            }
        });

    context.subscriptions.push(savePostDisposable);
}

export async function pushPost(post: PostStruct, publish: Boolean) {
    if (post.postid) {
        await blogOperate.editPost(post, publish);
    }
    else {
        let postId = await blogOperate.newPos(post, publish);
        blogFile.updatePostIdByTilte(postId, post.title);
        post.postid = postId;
    }
    post = await blogOperate.getPost(post.postid);
    await blogFile.pullPost(post);
    blogPostProvider.refresh();
}
