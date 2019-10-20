import * as vscode from 'vscode';
import { blogPostProvider, BlogPostItem } from '../blog/blog-post-provider';
import { blogCategoriesProvider } from '../blog/blog-categories-provider';
import { blogFile } from '../blog/blog-file';

export function addCategoryActivate(context: vscode.ExtensionContext) {

    let addCategoryDisposable = vscode.commands.registerCommand('writeCnblog.addCategory',
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
                        blogFile.addCategories(id, selects);
                        vscode.window.showInformationMessage("添加完成");
                        blogPostProvider.refresh();
                    }
                }
            });
        });

    context.subscriptions.push(addCategoryDisposable);
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
