import * as fs from 'fs';
import * as path from 'path';

import { PostStruct } from "../rpc/rpc-package";
import { PostImageReplace } from './post-image-replace';
import { blogDirName, fileExt, blogIndexName } from '../constants';
import { PostIndexInfo, PostFile, PostBaseInfo, PostState } from './shared';
import { BlogPostFile } from './blog-post-file';
import { blogWorkspace } from './blog-workspace';

export class BlogFile {

    /**
     * 读取本地的文章列表
     */
    public readPosts(): Array<PostBaseInfo> {
        let postBaseInfos = new Array<PostBaseInfo>();
        if (blogWorkspace.hasWorkspace) {
            let folderPath = blogWorkspace.folderPath;
            let postIndexs = this.readPostIndexs(folderPath);

            this.fillPostIndex(folderPath, postIndexs);

            let postBaseInfosByIndex = this.postBaseInfosByIndex(postIndexs);

            postBaseInfos.push(...postBaseInfosByIndex);
        }

        return postBaseInfos;
    }

    /**
     * 填补索引
     * @param postIndexs 
     */
    private fillPostIndex(folderPath: string, postIndexs: PostIndexInfo[]): void {
        let postFiles = this.readPostFiles(folderPath);
        postFiles.filter(postFile => postIndexs.findIndex(p => p.title === postFile.title) === -1)
            .forEach(postFile => {
                let postIndex: PostIndexInfo = {
                    postid: 0,
                    title: postFile.title
                };
                postIndexs.push(postIndex);
            });
        this.savePostIndexs(folderPath, postIndexs);
    }

    /**
     * 读取文章索引的内容，并合并文件信息
     * @param postIndexs 
     * @param postFiles 
     */
    private postBaseInfosByIndex(postIndexs: PostIndexInfo[]): Array<PostBaseInfo> {
        return postIndexs.map<PostBaseInfo>(postIndex => {
            let blogPostFile = new BlogPostFile(postIndex);

            let postBaseInfo: PostBaseInfo = {
                postId: postIndex.postid,
                title: postIndex.title,
                state: PostState.R,
                fsPath: blogPostFile.postPath
            };

            if (!blogPostFile.exists()) {
                postBaseInfo.state = PostState.D;
            }
            else if (blogPostFile.isNew()) {
                postBaseInfo.state = PostState.U;
            }
            else if (blogPostFile.isPostModify()) {
                postBaseInfo.state = PostState.M;
                postBaseInfo.remoteTitle = postIndex.remoteTitle;
                postBaseInfo.remotePath = blogPostFile.remotePostPath;
            }

            return postBaseInfo;
        });
    }

    /**
     * 获取文章的文件列表
     * @param folderPath 
     */
    private readPostFiles(folderPath: string): Array<PostFile> {
        let postFiles = new Array<PostFile>();
        const children = fs.readdirSync(folderPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(folderPath, child);
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
     * @param folderPath 
     */
    private readPostIndexs(folderPath: string): Array<PostIndexInfo> {
        let indexPath = path.join(folderPath, blogDirName, blogIndexName);
        if (fs.existsSync(indexPath)) {
            let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
            return JSON.parse(context);
        }
        return new Array<PostIndexInfo>();
    }

    /**
     * 保存索引
     * @param folderPath 
     * @param postIndexs 
     */
    private savePostIndexs(folderPath: string, postIndexs: Array<PostIndexInfo>): void {
        let indexPath = path.join(folderPath, blogDirName, blogIndexName);
        fs.writeFileSync(indexPath, JSON.stringify(postIndexs));
    }

    /**
     * 更新多个文章到本地
     * @param posts 
     */
    public async pullPosts(posts: Array<PostStruct>): Promise<void> {
        if (await blogWorkspace.tryCreateBlogWorkspace()) {
            let folderPath = blogWorkspace.folderPath;
            let postIndexs = this.readPostIndexs(folderPath);
            let postImageReplace: PostImageReplace = new PostImageReplace(folderPath);

            for (let index = 0; index < posts.length; index++) {
                const post = posts[index];
                let postIndex = postIndexs.find(p => p.postid === post.postid);
                if (!postIndex) {
                    postIndex = { postid: post.postid, title: post.title, remoteTitle: post.title };
                    postIndexs.push(postIndex);
                }
                let description = await postImageReplace.toLocal(post.description);
                let blogPostFile = new BlogPostFile(postIndex);

                blogPostFile.updatePostWhenNotExists(post.title, description);
                blogPostFile.updateRemotePost(post.title, description);
            }

            this.savePostIndexs(folderPath, postIndexs);
        }
    }

    /**
     * 更新一个文章到本地
     * @param post 
     */
    public async pullPost(post: PostStruct): Promise<void> {
        let postId = post.postid.toString();
        let folderPath = blogWorkspace.folderPath;
        let postIndexs = this.readPostIndexs(folderPath);
        let postIndex = postIndexs.find(p => p.postid === postId);
        if (postIndex) {
            let postImageReplace: PostImageReplace = new PostImageReplace(folderPath);
            let description = await postImageReplace.toLocal(post.description);
            let blogPostFile = new BlogPostFile(postIndex);
            blogPostFile.updateRemotePost(post.title, description);
        }
        this.savePostIndexs(folderPath, postIndexs);
    }

    /**
     * 新建一个文章
     * @param title 
     */
    public createPost(title: string): void {
        let folderPath = blogWorkspace.folderPath;
        let postIndexs = this.readPostIndexs(folderPath);

        if (postIndexs.findIndex(p => p.title === title) !== -1) {
            throw new Error("不能相同标题");
        }

        let postIndex: PostIndexInfo = {
            postid: 0,
            title: title
        };
        let blogPostFile = new BlogPostFile(postIndex);
        blogPostFile.create();

        postIndexs.push(postIndex);
        this.savePostIndexs(folderPath, postIndexs);
    }

    /**
     * 查找文章
     * @param postIndexInfo 
     */
    public getPost(postBaseInfo: PostBaseInfo): PostStruct | undefined {
        if (postBaseInfo && postBaseInfo.fsPath) {
            let description = fs.readFileSync(postBaseInfo.fsPath, { encoding: 'utf8' });
            //TODO:要转换图片地址和上传图片
            let post: PostStruct = {
                postid: postBaseInfo.postId,
                title: postBaseInfo.title,
                description: description,
                categories: ["[Markdown]"]
            };
            return post;
        }
        return undefined;
    }

    /**
     * 
     * @param postId 
     * @param tilte 
     */
    public updatePostIdByTilte(postId: string, tilte: string): void {
        let folderPath = blogWorkspace.folderPath;
        let postIndexs = this.readPostIndexs(folderPath);
        let postIndex = postIndexs.find(p => p.title === tilte);
        if (postIndex) {
            postIndex.postid = postId;
            this.savePostIndexs(folderPath, postIndexs);
        }
    }

    /**
     * 重命名标题
     * @param postBaseInfo 
     * @param newTitle 
     */
    public renameTitle(postBaseInfo: PostBaseInfo, newTitle: string): void {
        if (postBaseInfo.fsPath) {
            let folderPath = blogWorkspace.folderPath;
            let postIndexs = this.readPostIndexs(folderPath);
            let postIndex = postIndexs.find(p => p.title === postBaseInfo.title);
            if (postIndex) {
                let blogPostFile = new BlogPostFile(postIndex);
                blogPostFile.rename(newTitle);
                postBaseInfo.fsPath = blogPostFile.postPath;
                this.savePostIndexs(folderPath, postIndexs);
            }
        }
    }

    /**
     * 删除文章
     * @param postBaseInfo 
     */
    public deletePost(postBaseInfo: PostBaseInfo): void {
        if (postBaseInfo.fsPath) {
            let folderPath = blogWorkspace.folderPath;
            let postIndexs = this.readPostIndexs(folderPath);
            let index = postIndexs.findIndex(p => p.title === postBaseInfo.title);
            if (index !== -1) {
                let blogPostFile = new BlogPostFile(postIndexs[index]);
                blogPostFile.delete();
                postIndexs.splice(index, 1);
                this.savePostIndexs(folderPath, postIndexs);
            }
        }
    }
}

export const blogFile: BlogFile = new BlogFile();