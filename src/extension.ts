'use strict';
import * as vscode from 'vscode';

import { blogWorkspace } from './blog/blog-workspace';
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

export function activate(context: vscode.ExtensionContext) {

    blogPostProvider.initialize(context);
    blogWorkspace.initialize(context);
    vscode.window.createTreeView('blogPostExplorer', { treeDataProvider: blogPostProvider });
    vscode.window.createTreeView('blogCategoriesExplorer', { treeDataProvider: blogCategoriesProvider });
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
}

export function deactivate() {
}
