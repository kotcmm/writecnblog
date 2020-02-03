'use strict';
import * as vscode from 'vscode';

import * as util from './runtimeManager/common';
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
import { selectCategoryActivate } from './commands/selectCategory';
import { removeCategoryActivate } from './commands/removeCategory';
import { setConfigActivate } from './commands/setConfig';
import { pasteImageFromClipboardActivate } from './commands/pasteImageFromClipboard';
import { seeLinkActivate } from './commands/seeLink';
import { Logger } from './runtimeManager/logger';
import { ExtensionDownloader } from './runtimeManager/ExtensionDownloader';

export async function activate(context: vscode.ExtensionContext) {

    blogPostProvider.initialize(context);
    vscode.window.createTreeView('blogPostExplorer', { treeDataProvider: blogPostProvider });
    vscode.window.createTreeView('blogCategoriesExplorer', { treeDataProvider: blogCategoriesProvider });
    setConfigActivate(context);
    createPostActivate(context);
    seeLinkActivate(context);
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
    selectCategoryActivate(context);
    removeCategoryActivate(context);

    try {
        pasteImageFromClipboardActivate(context);
    } catch (error) {
        const logger = new Logger();

        const extensionId = 'caipeiyu.write-cnblog';
        const extension = vscode.extensions.getExtension(extensionId);
        util.setExtensionPath(context.extensionPath);

        if (await ensureRuntimeDependencies(extension, logger)) {
            pasteImageFromClipboardActivate(context);
        } else {
            vscode.window.showInformationMessage("下载依赖失败，剪切板贴图不可用");
        }
    }
}

export function deactivate() {
}

function ensureRuntimeDependencies(extension: vscode.Extension<any> | undefined, logger: Logger): Promise<boolean> {
    return util.installFileExists(util.InstallFileType.Lock)
        .then((exists) => {
            if (!extension) {
                return false;
            }
            if (!exists) {
                const downloader = new ExtensionDownloader(logger, extension.packageJSON);
                return downloader.installRuntimeDependencies();
            } else {
                return true;
            }
        });
}
