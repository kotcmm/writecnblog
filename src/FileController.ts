"use strict";
import {  window, workspace, TextEditor, QuickPickOptions, QuickPickItem } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileController {

  public createFile(newFileName : string): Promise<string> {
    return new Promise(function (resolve, reject) {
      let fileExists: boolean = fs.existsSync(newFileName);

      if (!fileExists) {

        fs.appendFile(newFileName, '', (err) => {
          if (err) {
            return reject(err.message);
          }

          return resolve(newFileName);
        });
      } else {
        return resolve(newFileName);
      }

    });
  }

  public openFileInEditor(fileName : string): Promise<TextEditor> {
    return new Promise(function (resolve, reject) {

      workspace.openTextDocument(fileName).then((textDocument) => {
        if (!textDocument) {
          return reject('Could not open file!');
        }

        window.showTextDocument(textDocument).then((editor) => {
          if (!editor) {
            return reject('Could not show document!');
          }

          return resolve(editor);
        });
      });
    });
  }

  public determineFullPath(filePath :string): Promise<string> {
    let that = this;
    return new Promise(function (resolve, reject) {

      if (!workspace.rootPath && !window.activeTextEditor) {
        return that.inputPath(resolve, reject,filePath);
      }

      if (window.activeTextEditor) {
        if (window.activeTextEditor.document.isUntitled) {
          return that.inputPath(resolve, reject,filePath);
        }else{
          return resolve(path.join(window.activeTextEditor.document.fileName , '..', filePath));
        }
      } else {
        return resolve(path.join(workspace.workspaceFolders?workspace.workspaceFolders[0].name:"", filePath));
      }

    });

  }
  
  private inputPath(resolve: (value?: string | PromiseLike<string> | undefined) => void, reject: (reason?: any) => void,filePath: string){
    const homePath: string|& undefined = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] ;
          let suggestedPath: string = path.join(homePath?homePath:"", filePath);

          const options: QuickPickOptions = {
            matchOnDescription: true,
            placeHolder: "是否使用默认路径?"
          };

          const choices: QuickPickItem[] = [
            { label: 'Yes', description: `使用 ${suggestedPath}.` },
            { label: 'No', description: '自定义路径.' }
          ];

          window.showQuickPick(choices, options).then((choice) => {
            if (!choice) {
              return reject(null);
            }

            if (choice.label === 'Yes') {
              return resolve(suggestedPath);
            }

            window.showInputBox({
              prompt: `输入一个基本路径 '${filePath}'`,
              value: homePath
            }).then((basePath) => {
              if (!basePath) {
                return reject(null);
              }

              return resolve(path.join(basePath, filePath));
            });
          });
  }
}
