import * as vscode from 'vscode';
import { blogPostProvider, BlogPostItem } from '../blog/blog-post-provider';
import { blogCategoriesProvider } from '../blog/blog-categories-provider';
import { blogFile } from '../blog/blog-file';

export function selectCategoryActivate(context: vscode.ExtensionContext) {

    let selectCategoryDisposable = vscode.commands.registerCommand('writeCnblog.selectCategory',
        (blogPostItem: BlogPostItem) => {
            vscode.window.showQuickPick(
                getCategories(blogPostItem),
                {
                    canPickMany: true
                }
            ).then(selects => {
                if (selects && selects.length > 0) {
                    let id = blogPostItem.postBaseInfo!.id;
                    if (id) {
                        try {
                            blogFile.addCategories(id, selects);
                            vscode.window.showInformationMessage("添加完成");
                            blogPostProvider.refresh();
                        } catch (error) {
                            vscode.window.showErrorMessage(error.message);
                        }
                    }
                }
            });
        });

    context.subscriptions.push(selectCategoryDisposable);
}

async function getCategories(blogPostItem: BlogPostItem): Promise<string[]> {
    let categories = await blogCategoriesProvider.getCategories();
    return categories.filter(c => {
        let postCategories = blogPostItem.postBaseInfo!.categories;
        if (postCategories) {
            return !postCategories.includes(c);
        }
        return true;
    });

}
