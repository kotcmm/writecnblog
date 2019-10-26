import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { blogDirName, remotePostDirName } from '../constants';
import { blogConfig } from './blog-config';

export class BlogWorkspace {

    private get workspaceFolder(): string | undefined {
        return blogConfig.blogWorkspace();
    }

    async setWorkspaceFolder(fsPath: string) {
        await blogConfig.setBlogWorkspace(fsPath);
    }

    /**
     * 判断是否为文章的工作目录
     * @param fsPath 
     */
    private isBlogDirectory(fsPath: string): boolean {
        const children = fs.readdirSync(fsPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const stat = fs.statSync(path.join(fsPath, child));
            if (stat.isDirectory() && child === blogDirName) {
                return true;
            }
        }
        return false;
    }

    /**
     * 选择工作目录
     */
    private async selectWorkspace(): Promise<string | undefined> {
        let uris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false
        });

        if (uris) {
            return uris[0].fsPath;
        }

        return undefined;
    }

    /**
     * 是否有选择一个工作空间
     */
    get hasWorkspace(): boolean {
        if (this.workspaceFolder) {
            return this.isBlogDirectory(this.workspaceFolder);
        }
        return false;
    }

    /**
    * 本地文章存储文件夹
    */
    get folderPath(): string {
        if (!this.workspaceFolder) {
            throw new Error("请先选择一个工作空间");
        }
        return this.workspaceFolder;
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

        let workspaceFolder = this.workspaceFolder;
        let folder = workspaceFolder ? workspaceFolder : await this.selectWorkspace();

        if (!folder) {
            return false;
        }

        await this.setWorkspaceFolder(folder);
        if (this.isBlogDirectory(folder)) {
            return true;
        }

        mkdirp.sync(this.folderPath);
        mkdirp.sync(this.remoteFolderPath);

        return true;
    }
}

export const blogWorkspace: BlogWorkspace = new BlogWorkspace();