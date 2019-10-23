import * as vscode from 'vscode';

export function pasteImageFromClipboardActivate(context: vscode.ExtensionContext) {

    let pasteImageFromClipboardDisposable = vscode.commands.registerCommand('writeCnblog.pasteImageFromClipboard',
        () => {

        });

    context.subscriptions.push(pasteImageFromClipboardDisposable);
}
