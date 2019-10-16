import * as vscode from 'vscode';
// import { blogOperate } from '../blog/blog-operate';

export function pullPostActivate(context: vscode.ExtensionContext) {

    let pullPostDisposable = vscode.commands.registerCommand('writeCnblog.pullPost', async () => {
        // blogOperate.newPos(true);
    });

    context.subscriptions.push(pullPostDisposable);
}
