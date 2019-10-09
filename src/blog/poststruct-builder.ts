import * as vscode from 'vscode';
import * as path from 'path';
import { PostStruct } from "../rpc/rpc-package";

export class PostStructBuilder {
    build(): PostStruct {
        let textEditor = vscode.window.activeTextEditor;
        if (textEditor) {
            return {
                title: this.titleName(textEditor.document.fileName),
                description: textEditor.document.getText(),
                categories: ["[Markdown]"],
                dateCreated: new Date()
            };
        }
        throw new Error("没有打开要发布的文章！");
    }

    /**
     * 获取文章标题
     * @param fileName 
     */
    titleName(fileName: string): string {
        return path.parse(fileName).name;
    }
}