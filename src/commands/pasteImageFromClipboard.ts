import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { blogWorkspace } from '../blog/blog-workspace';
import { imageDirName } from '../constants';

let clip: any;

export function pasteImageFromClipboardActivate(context: vscode.ExtensionContext) {
    if (!clip) {
        clip = require('clipboard-data');
    }
    let pasteImageFromClipboardDisposable = vscode.commands.registerCommand('writeCnblog.pasteImageFromClipboard',
        () => {
            try {
                let textEditor = vscode.window.activeTextEditor;
                if (textEditor) {
                    let pngData = clip.getImage();
                    let imageShortPath = path.join(imageDirName, `${Date.now().toString()}.png`);
                    let imagePath = path.join(blogWorkspace.folderPath, imageShortPath);
                    let writeStream = fs.createWriteStream(imagePath)
                        .on('close', function () {
                            if (textEditor) {
                                var url = `![](${imageShortPath})`;
                                textEditor.edit(function editDocument(editParams) {
                                    if (textEditor) {
                                        editParams.insert(textEditor.selection.active, url);
                                    }
                                });
                            }
                        });
                    writeStream.write(pngData);
                    writeStream.close();
                }
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        });

    context.subscriptions.push(pasteImageFromClipboardDisposable);
}
