import * as vscode from 'vscode';
import { blogCategoriesProvider } from '../blog/blog-categories-provider';
import { blogOperate } from '../blog/blog-operate';

export function createCategoryActivate(context: vscode.ExtensionContext) {

    let createCategoryDisposable = vscode.commands.registerCommand('writeCnblog.createCategory',
        () => {
            vscode.window.showInputBox({ prompt: "输入分类名称" }).then(async categorie => {
                if (categorie) {
                    try {
                        await blogOperate.newCategory(categorie);
                        await blogCategoriesProvider.refresh();
                    } catch (error) {
                        vscode.window.showErrorMessage(error.message);
                    }
                }
            });
        });

    context.subscriptions.push(createCategoryDisposable);
}
