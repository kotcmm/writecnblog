import * as vscode from 'vscode';
import { BlogPostItem } from '../blog/blog-post-provider';


export function seeLinkActivate(context: vscode.ExtensionContext) {

    let seeLinkDisposable = vscode.commands.registerCommand('writeCnblog.seeLink',
        (blogPostItem: BlogPostItem) => {
            if (blogPostItem.postBaseInfo && blogPostItem.postBaseInfo.link) {
                vscode.commands.executeCommand('vscode.open',
                    vscode.Uri.parse(blogPostItem.postBaseInfo.link));
            } else {
                vscode.window.showInformationMessage("文章还未发布到网站");
            }
        });

    context.subscriptions.push(seeLinkDisposable);
}
