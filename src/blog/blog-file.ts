import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { PostStruct } from "../rpc/rpc-package";
import { PostImageReplace } from './post-image-replace';

const blogDirName = ".cnblog";
const blogWorkspaceFolderKey = "blogWorkspaceFolder";
const fileExt = ".md";

export class BlogFile {

    constructor(private context: vscode.ExtensionContext) {

    }

    /**
     * 存放文章的工作目录
     */
    private get blogWorkspaceFolderUri(): vscode.Uri | undefined {
        let uri = this.context.globalState.get<vscode.Uri>(blogWorkspaceFolderKey);
        return uri;
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
     * 创建一个博客工作目录
     */
    private async tryCreateBlogWorkspace(): Promise<boolean> {
        let folderUri = this.blogWorkspaceFolderUri;
        if (!folderUri) {
            let uris = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false
            });

            if (uris) {
                folderUri = uris[0];
            } else {
                return false;
            }
        }

        if (!this.isBlogDirectory(folderUri)) {
            mkdirp.sync(path.join(folderUri.fsPath, blogDirName));
            this.context.globalState.update(blogWorkspaceFolderKey, folderUri);
        }

        return true;
    }

    /**
     * 读取本地的文章列表
     */
    public readPosts(): Array<PostBaseInfo> {
        let postBaseInfos = new Array<PostBaseInfo>();
        let uri = this.blogWorkspaceFolderUri;
        if (uri) {
            let postFiles = this.readPostFiles(uri);
            let postIndexs = this.readPostIndexs(uri);

            let postBaseInfosByIndex = this.postBaseInfosByIndex(postIndexs, postFiles);
            let postBaseInfosByFile = this.postBaseInfoByFile(postFiles, postIndexs);

            postBaseInfos.push(...postBaseInfosByFile);
            postBaseInfos.push(...postBaseInfosByIndex);
        }

        return postBaseInfos;
    }

    /**
     * 读取文章文件，排除掉索引内的文章
     * @param postFiles 
     * @param postIndexs 
     */
    private postBaseInfoByFile(postFiles: PostFile[], postIndexs: PostIndexInfo[]): Array<PostBaseInfo> {
        return postFiles.filter(postFile => postIndexs.findIndex(p => p.title === postFile.title) === -1).map<PostBaseInfo>(postFile => {
            return {
                title: postFile.title,
                fsPath: postFile.fsPath,
                state: PostState.U
            };
        });
    }

    /**
     * 读取文章索引的内容，并合并文件信息
     * @param postIndexs 
     * @param postFiles 
     */
    private postBaseInfosByIndex(postIndexs: PostIndexInfo[], postFiles: PostFile[]): Array<PostBaseInfo> {
        return postIndexs.map<PostBaseInfo>(postIndex => {
            let postBaseInfo: PostBaseInfo = {
                postId: postIndex.postid,
                title: postIndex.title as string
            };

            let postFile = postFiles.find(p => p.title === postIndex.title);
            if (postFile) {
                postBaseInfo.fsPath = postFile.fsPath;
                //TODO:判断是否有更改
            }
            else {
                postBaseInfo.state = PostState.D;
            }

            return postBaseInfo;
        });
    }

    /**
     * 获取文章的文件列表
     * @param uri 
     */
    private readPostFiles(uri: vscode.Uri): Array<PostFile> {
        let postFiles = new Array<PostFile>();
        const children = fs.readdirSync(uri.fsPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(uri.fsPath, child);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                postFiles.push({
                    title: path.basename(child, fileExt),
                    fsPath: filePath
                });
            }
        }
        return postFiles;
    }

    /**
     * 读取文章索引
     * @param uri 
     */
    private readPostIndexs(uri: vscode.Uri): Array<PostIndexInfo> {
        let indexPath = path.join(uri.fsPath, blogDirName, "index");
        let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
        return JSON.parse(context);
    }

    /**
     * 更新多个文章到本地
     * @param posts 
     */
    public async pullPosts(posts: Array<PostStruct>): Promise<void> {
        if (await this.tryCreateBlogWorkspace()) {
            let uri = this.blogWorkspaceFolderUri!;
            let folderPath = uri.fsPath;
            let postIndexs = this.readPostIndexs(uri);
            let postImageReplace: PostImageReplace = new PostImageReplace(folderPath);
            posts.forEach(async post => {
                let file = `${post.title}${fileExt}`;
                let postPath = path.join(folderPath, file);
                let description = postImageReplace.toLocal(post.description as string);
                fs.writeFileSync(postPath, description);
                //TODO:如果不存在添加索引，如果存在更新索引相关信息
                postIndexs.push({ postid: post.postid, title: post.title ,imageIndexInfo:[]});
            });

            let indexPath = path.join(folderPath, blogDirName, "index");
            fs.writeFileSync(indexPath, JSON.stringify(postIndexs));
        }
    }

    /**
     * 更新一个文章到本地
     * @param post 
     */
    public pullPost(post: PostStruct): void {

    }
}

export interface PostFile {
    title: string;
    fsPath: string;
}

export enum PostState {
    U,//新建
    M,//修改
    D//删除
}

export interface PostBaseInfo {
    postId?: any;
    title: string;
    state?: PostState;
    fsPath?: string;
}

export interface PostIndexInfo {
    postid: any;
    title: string;
    imageIndexInfo: ImageIndexInfo[];
}

export interface ImageIndexInfo {
    md5: string;
    local: string;
    remote: string;
}
