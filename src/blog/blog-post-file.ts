import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { PostIndexInfo } from "./shared";
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
        return path.join(this.folderPath, `${this.postIndexInfo.title}${fileExt}`);
    }

    /**
     * 远端某一个文章路径
     */
    get remotePostPath(): string {
        return path.join(this.remoteFolderPath, `${this.postIndexInfo.remoteTitle}${fileExt}`);
    }

    constructor(private postIndexInfo: PostIndexInfo) {

    }

    /**
    * 文章是否有修改
    */
    public isPostModify(): boolean {
        let postIndexInfo = this.postIndexInfo;

        if (postIndexInfo.remoteTitle !== postIndexInfo.title) {
            return true;
        }

        let postPath = this.postPath;
        let remotePostPath = this.remotePostPath;

        return fs.readFileSync(postPath, { encoding: 'utf8' }) !==
            fs.readFileSync(remotePostPath, { encoding: 'utf8' });
    }

    /**
     * 更新本地文章，当文章不存在的时候
     * @param title 
     * @param description 
     */
    public updatePostWhenNotExists(title: string, description: string): void {
        let postPath = this.postPath;

        if (!fs.existsSync(postPath)) {
            fs.writeFileSync(postPath, description);
        }

        if (this.postIndexInfo.title !== title) {
            this.postIndexInfo.title = title;
        }
    }

    /**
     * 更新远端文章
     * @param title 
     * @param description 
     */
    public updateRemotePost(title: string, description: string): void {
        if (this.postIndexInfo.remoteTitle !== title) {
            let remotePostPath = this.remotePostPath;
            if (fs.existsSync(remotePostPath)) {
                rimraf.sync(remotePostPath);
            }
            this.postIndexInfo.remoteTitle = title;
        }

        fs.writeFileSync(this.remotePostPath, description);
    }
}