'use strict';
import * as vscode from 'vscode';

import { diffPostActivate } from './commands/diffPost';
import { openPostActivate } from './commands/openPost';
import { getRecentPostsActivate } from './commands/getRecentPosts';
import { createPostActivate } from './commands/createPost';
import { savePostActivate } from './commands/savePost';
import { publishPostActivate } from './commands/publishPost';
import { pullPostActivate } from './commands/pullPost';
import { blogPostProvider } from './blog/blog-post-provider';
import { renameTitleActivate } from './commands/renameTitle';
import { deletePostActivate } from './commands/deletePost';
import { blogCategoriesProvider } from './blog/blog-categories-provider';
import { refreshCategoriesActivate } from './commands/refreshCategories';
import { createCategoryActivate } from './commands/createCategory';
import { addCategoryActivate } from './commands/addCategory';
import { removeCategoryActivate } from './commands/removeCategory';
import { setConfigActivate } from './commands/setConfig';
import { pasteImageFromClipboardActivate } from './commands/pasteImageFromClipboard';

export function activate(context: vscode.ExtensionContext) {

    blogPostProvider.initialize(context);
    vscode.window.createTreeView('blogPostExplorer', { treeDataProvider: blogPostProvider });
    vscode.window.createTreeView('blogCategoriesExplorer', { treeDataProvider: blogCategoriesProvider });
    setConfigActivate(context);
    createPostActivate(context);
    getRecentPostsActivate(context);
    openPostActivate(context);
    diffPostActivate(context);
    savePostActivate(context);
    publishPostActivate(context);
    pullPostActivate(context);
    renameTitleActivate(context);
    deletePostActivate(context);
    refreshCategoriesActivate(context);
    createCategoryActivate(context);
    addCategoryActivate(context);
    removeCategoryActivate(context);
    pasteImageFromClipboardActivate(context);
}

export function deactivate() {
}
