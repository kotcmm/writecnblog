import * as vscode from 'vscode';
import { blogCategoriesProvider } from '../blog/blog-categories-provider';

export function refreshCategoriesActivate(context: vscode.ExtensionContext) {

    let refreshCategoriesDisposable = vscode.commands.registerCommand('writeCnblog.refreshCategories',
        () => {
            blogCategoriesProvider.refresh();
        });

    context.subscriptions.push(refreshCategoriesDisposable);
}
