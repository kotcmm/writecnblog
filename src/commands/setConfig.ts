import * as vscode from 'vscode';
import { blogPostProvider } from '../blog/blog-post-provider';
import { blogConfig } from '../blog/blog-config';
import { blogCategoriesProvider } from '../blog/blog-categories-provider';
import { blogOperate } from '../blog/blog-operate';

export function setConfigActivate(context: vscode.ExtensionContext) {

    let setConfigDisposable = vscode.commands.registerCommand('writeCnblog.setConfig',
        async () => {
            let rpcUrl = await vscode.window.showInputBox({
                prompt: "MetaWeblog访问地址",
                value: blogConfig.rpcUrl()
            });
            if (!rpcUrl) { return; }
            let userName = await vscode.window.showInputBox({
                prompt: "用户名",
                value: blogConfig.userName()
            });
            if (!userName) { return; }
            let password = await vscode.window.showInputBox({
                prompt: "密码",
                password: true
            });
            if (!password) { return; }

            try {
                let blogInfo = await blogOperate.blogInfo(rpcUrl,
                    {
                        username: userName!,
                        password: password
                    });

                await blogConfig.setBlogId(blogInfo.blogid);
                await blogConfig.setRpcUrl(rpcUrl);
                await blogConfig.setUserName(userName);
                await blogConfig.setPassword(password);

                vscode.window.showInformationMessage("配置成功");
                blogPostProvider.refresh();
                blogCategoriesProvider.refresh();
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }

        });

    context.subscriptions.push(setConfigDisposable);
}
