'use strict';
import * as vscode from 'vscode';

import { blogWorkspace } from './blog/blog-workspace';
import { diffPostActivate } from './commands/diffPost';
import { openPostActivate } from './commands/openPost';
import { getRecentPostsActivate } from './commands/getRecentPosts';
import { newPostActivate } from './commands/newPost';

export function activate(context: vscode.ExtensionContext) {
    blogWorkspace.initialize(context);
    newPostActivate(context);
    diffPostActivate(context);
    openPostActivate(context);
    getRecentPostsActivate(context);
}

export function deactivate() {
}
