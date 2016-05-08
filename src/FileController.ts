"use strict"
import {  window, workspace, TextEditor, QuickPickOptions, QuickPickItem } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileController {

  public createFile(newFileName): Promise<string> {
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

  public openFileInEditor(fileName): Promise<TextEditor> {
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

  public determineFullPath(filePath): Promise<string> {
    let that = this;
    return new Promise(function (resolve, reject) {

      if (!workspace.rootPath && !window.activeTextEditor) {
        return that.inputPath(resolve, reject,filePath);
      }

      const root: string = window.activeTextEditor ? window.activeTextEditor.document.fileName : workspace.rootPath;

      if (window.activeTextEditor) {
        if (window.activeTextEditor.document.isUntitled) {
          return that.inputPath(resolve, reject,filePath);
        }else{
          return resolve(path.join(root, '..', filePath));
        }
      } else {
        return resolve(path.join(root, filePath));
      }

    });

  }
  
  private inputPath(resolve, reject,filePath){
    const homePath: string = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
          let suggestedPath: string = path.join(homePath, filePath);

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
            })
          });
  }
}
