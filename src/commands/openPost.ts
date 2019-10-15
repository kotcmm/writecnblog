import * as vscode from 'vscode';

export function openPostActivate(context: vscode.ExtensionContext) {

    let openPostDisposable = vscode.commands.registerCommand('writeCnblog.openPost',
        (resource) => vscode.window.showTextDocument(resource));

    context.subscriptions.push(openPostDisposable);
}
