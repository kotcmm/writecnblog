import * as vscode from 'vscode';
import { Uri } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { blogWorkspaceFolderKey, blogDirName, remotePostDirName } from '../constants';

export class BlogWorkspace {

    private context: vscode.ExtensionContext | undefined;

    private _workspaceFolder: Uri | undefined;

    get workspaceFolder(): Uri | undefined {
        if (this.context === undefined) {
            throw new Error("请先初始化context");
        }
        if (!this._workspaceFolder) {
            this._workspaceFolder = this.context.globalState.get<Uri>(blogWorkspaceFolderKey);
        }
        return this._workspaceFolder;
    }

    set workspaceFolder(uri: Uri | undefined) {
        if (this.context === undefined) {
            throw new Error("请先初始化context");
        }
        this._workspaceFolder = uri;
        this.context.globalState.update(blogWorkspaceFolderKey, uri);
    }

    public initialize(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    /**
     * 判断是否为文章的工作目录
     * @param uri 
     */
    private isBlogDirectory(uri: vscode.Uri): boolean {
        const children = fs.readdirSync(uri.fsPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const stat = fs.statSync(path.join(uri.fsPath, child));
            if (stat.isDirectory() && child === blogDirName) {
                return true;
            }
        }
        return false;
    }

    /**
     * 选择工作目录
     */
    private async selectWorkspace(): Promise<Uri | undefined> {
        let uris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false
        });

        if (uris) {
            return uris[0];
        }

        return undefined;
    }

    /**
     * 是否有选择一个工作空间
     */
    get hasWorkspace(): boolean {
        return this.workspaceFolder !== undefined &&
            this.isBlogDirectory(this.workspaceFolder);
    }

    /**
    * 本地文章存储文件夹
    */
    get folderPath(): string {
        if (this.workspaceFolder === undefined) {
            throw new Error("请先选择一个工作空间");
        }
        return this.workspaceFolder.fsPath;
    }

    /**
     * 远端文章存储文件夹
     */
    get remoteFolderPath(): string {
        return path.join(this.folderPath, blogDirName, remotePostDirName);
    }

    /**
     * 尝试创建一个博客工作目录
     */
    public async tryCreateBlogWorkspace(): Promise<boolean> {

        if (this.context === undefined) {
            throw new Error("请先初始化context");
        }

        let workspaceFolder = this.workspaceFolder;
        let folder = workspaceFolder ? workspaceFolder : await this.selectWorkspace();

        this.workspaceFolder = folder;
        if (folder && this.isBlogDirectory(folder)) {
            return true;
        }

        if (folder) {
            mkdirp.sync(this.folderPath);
            mkdirp.sync(this.remoteFolderPath);
            return true;
        }

        return false;
    }
}

export const blogWorkspace: BlogWorkspace = new BlogWorkspace();