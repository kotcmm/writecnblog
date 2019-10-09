import * as vscode from 'vscode';
import { BlogOperate } from '../blog/blog-operate';

export let newPostDisposable = vscode.commands.registerCommand('extension.writeCnblog.newPost', async () => {
    let blogOperate = new BlogOperate();
    blogOperate.newPos(true);
});
