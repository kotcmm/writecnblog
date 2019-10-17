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
import { refreshActivate } from './commands/refresh';
import { renameTitleActivate } from './commands/renameTitle';
import { deletePostActivate } from './commands/deletePost';

export function activate(context: vscode.ExtensionContext) {

    blogPostProvider.initialize(context);
    blogWorkspace.initialize(context);
    vscode.window.createTreeView('blogPostExplorer', { treeDataProvider: blogPostProvider });
    createPostActivate(context);
    refreshActivate(context);
    getRecentPostsActivate(context);
    openPostActivate(context);
    diffPostActivate(context);
    savePostActivate(context);
    publishPostActivate(context);
    pullPostActivate(context);
    renameTitleActivate(context);
    deletePostActivate(context);
}

export function deactivate() {
}
