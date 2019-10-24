import * as vscode from 'vscode';
const clip = require('clipboard-data');

export function pasteImageFromClipboardActivate(context: vscode.ExtensionContext) {

    let pasteImageFromClipboardDisposable = vscode.commands.registerCommand('writeCnblog.pasteImageFromClipboard',
        () => {
            try {
                let st = clip.getImage().toString("base64");
                console.log(st);
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        });

    context.subscriptions.push(pasteImageFromClipboardDisposable);
}
