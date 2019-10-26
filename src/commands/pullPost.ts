import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { BlogPostItem, blogPostProvider } from '../blog/blog-post-provider';
import { blogFile } from '../blog/blog-file';

export function pullPostActivate(context: vscode.ExtensionContext) {

    let pullPostDisposable = vscode.commands.registerCommand('writeCnblog.pullPost',
        async (blogPostItem: BlogPostItem) => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "获取最近文章!",
                cancellable: false
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the long running operation");
                });
                try {
                    if (blogPostItem.postBaseInfo) {
                        progress.report({ increment: 0 });
                        progress.report({ increment: 10, message: "下载文章内容..." });
                        let post = await blogOperate.getPost(blogPostItem.postBaseInfo.postId);
                        progress.report({ increment: 40, message: "下载图片和写入文章..." });
                        await blogFile.pullPost(post);
                        progress.report({ increment: 50, message: "下载完成" });
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
                var p = new Promise(resolve => {
                    blogPostProvider.refresh();
                    resolve();
                });
                return p;
            });

        });

    context.subscriptions.push(pullPostDisposable);
}
