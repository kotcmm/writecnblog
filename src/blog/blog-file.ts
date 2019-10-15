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
            let postFiles = this.readPostFiles(folderPath);
            let postIndexs = this.readPostIndexs(folderPath);

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
                let blogPostFile = new BlogPostFile(postIndex);
                if (blogPostFile.isPostModify()) {
                    postBaseInfo.state = PostState.M;
                }
                postBaseInfo.fsPath = postFile.fsPath;
                postBaseInfo.remoteTitle = postIndex.remoteTitle;
                postBaseInfo.remotePath = blogPostFile.remotePostPath;
            }
            else {
                postBaseInfo.state = PostState.D;
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
    public pullPost(post: PostStruct): void {

    }
}

export const blogFile: BlogFile = new BlogFile();