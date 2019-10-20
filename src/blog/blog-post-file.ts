import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { PostIndexInfo, PostState } from "./shared";
import { fileExt } from "../constants";
import { blogWorkspace } from "./blog-workspace";
//TODO:如果有相同标题，可能会覆盖文件问题
export class BlogPostFile {

    /**
     * 本地文章存储文件夹
     */
    get folderPath(): string {
        return blogWorkspace.folderPath;
    }

    /**
     * 远端文章存储文件夹
     */
    get remoteFolderPath(): string {
        return blogWorkspace.remoteFolderPath;
    }

    /**
     * 本地某一个文章路径
     */
    get postPath(): string {
        return path.join(this.folderPath,
            `${this.postIndexInfo.title}.${this.postIndexInfo.id}${fileExt}`);
    }

    /**
     * 远端某一个文章路径
     */
    get remotePostPath(): string | undefined {
        if (!this.postIndexInfo.remoteTitle) {
            return undefined;
        }
        return path.join(this.remoteFolderPath,
            `${this.postIndexInfo.remoteTitle}.${this.postIndexInfo.id}${fileExt}`);
    }

    constructor(private postIndexInfo: PostIndexInfo) {

    }

    /**
     * 获取索引信息
     */
    public getPostIndexInfo(): PostIndexInfo {
        return this.postIndexInfo;
    }

    /**
     * 创建新文章
     * @param title 
     */
    public create(title: string): void {
        this.postIndexInfo.title = title;
        fs.writeFileSync(this.postPath, "");
    }

    public delete(): void {
        rimraf.sync(this.postPath);
    }

    /**
     * 修改新名称
     * @param newTitle 
     */
    public rename(newTitle: string) {
        let oldPath = this.postPath;
        this.postIndexInfo.title = newTitle;
        fs.renameSync(oldPath, this.postPath);
    }

    /**
     * 文章是否为新建
     */
    public isNew(): boolean {
        return !this.postIndexInfo.remoteTitle &&
            !this.postIndexInfo.postid;
    }

    /**
     * 文章文件是否存在
     */
    public exists(): boolean {
        return fs.existsSync(this.postPath);
    }

    /**
    * 文章是否有修改
    */
    public isPostModify(): boolean {
        if (!this.remotePostPath || this.postIndexInfo.title === "") {
            return false;
        }

        let postIndexInfo = this.postIndexInfo;

        if (postIndexInfo.remoteTitle !== postIndexInfo.title) {
            return true;
        }

        return fs.readFileSync(this.postPath, { encoding: 'utf8' }) !==
            fs.readFileSync(this.remotePostPath, { encoding: 'utf8' });
    }

    /**
     * 文章状态
     */
    public postState(): PostState {
        if (!this.exists()) {
            return PostState.D;
        }
        else if (this.isNew()) {
            return PostState.U;
        }
        else if (this.isPostModify()) {
            return PostState.M;
        }
        return PostState.R;
    }

    /**
     * 更新本地文章
     * @param title 
     * @param description 
     */
    public updatePost(title: string, description: string): void {
        if (this.postIndexInfo.title !== title &&
            !this.isPostModify()) {
            if (fs.existsSync(this.postPath)) {
                rimraf.sync(this.postPath);
            }
            this.postIndexInfo.title = title;
        }

        if (!fs.existsSync(this.postPath)) {
            fs.writeFileSync(this.postPath, description);
        }
    }

    /**
     * 更新远端文章
     * @param title 
     * @param description 
     */
    public updateRemotePost(title: string, description: string): void {
        if (this.postIndexInfo.remoteTitle !== title) {
            if (this.remotePostPath) {
                if (fs.existsSync(this.remotePostPath)) {
                    rimraf.sync(this.remotePostPath);
                }
            }
            this.postIndexInfo.remoteTitle = title;
        }
        if (this.remotePostPath) {
            fs.writeFileSync(this.remotePostPath, description);
        }
    }

    /**
     * 更新类别目录
     * @param categories 
     */
    public updateCategories(categories: Array<string> | undefined) {
        this.postIndexInfo.categories = categories;
    }

    /**
     * 读取文章详情
     */
    public description(): string {
        return fs.readFileSync(this.postPath, { encoding: 'utf8' });
    }
}