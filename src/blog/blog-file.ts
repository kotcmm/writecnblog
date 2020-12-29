import * as fs from 'fs';
import * as path from 'path';

import { PostStruct } from "../rpc/rpc-package";
import { blogDirName, blogIndexName } from '../constants';
import { PostIndexInfo, PostFile, PostBaseInfo } from './shared';
import { BlogPostFile } from './blog-post-file';
import { blogWorkspace } from './blog-workspace';
import { postImageReplace } from './post-image-replace';

export class BlogFile {

    private _postIndexs: Array<PostIndexInfo>;

    constructor() {
        this._postIndexs = new Array<PostIndexInfo>();
    }

    /**
     * 工作空间目录
     */
    private get folderPath(): string {
        return blogWorkspace.folderPath;
    }

    /**
     * 索引路径
     */
    private get indexPath(): string {
        return path.join(this.folderPath, blogDirName, blogIndexName);
    }

    /**
     * 索引Id
     */
    private get indexId(): number {
        return this.postIndexs.length === 0 ?
            1 : this.postIndexs[this.postIndexs.length - 1].id + 1;
    }

    /**
     * 读取文章索引
     * @param folderPath 
     */
    private get postIndexs(): Array<PostIndexInfo> {
        if (this._postIndexs.length === 0) {
            let indexPath = this.indexPath;
            if (fs.existsSync(indexPath)) {
                let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
                this._postIndexs = JSON.parse(context);
            }
        }
        return this._postIndexs;
    }

    /**
     * 保存索引
     * @param folderPath 
     * @param postIndexs 
     */
    private set postIndexs(postIndexs: Array<PostIndexInfo>) {
        this._postIndexs = postIndexs;
        this.savePostIndexs();
    }

    /**
     * 持久化文章索引
     */
    private savePostIndexs() {
        fs.writeFileSync(this.indexPath, JSON.stringify(this.postIndexs));
    }

    /**
     * 索引里面是否存在标题为title
     * @param postIndexs 
     * @param title 
     */
    private hasIndexByTitle(title: string): boolean {
        return this.postIndexs.findIndex(p => p.title === title) !== -1;
    }

    /**
     * 更新或者添加索引
     * @param postIndex
     */
    private updateOrAddPostIndex(postIndex: PostIndexInfo): PostIndexInfo {

        let oldPostIndex = this.postIndexs.find(p => p.postid === postIndex.postid);
        if (oldPostIndex && postIndex.postid) {
            postIndex.id = oldPostIndex.id;
            if (oldPostIndex.title === oldPostIndex.remoteTitle) {//不相等不要覆盖
                oldPostIndex.title = postIndex.title;
            }
            oldPostIndex.remoteTitle = postIndex.remoteTitle;
            oldPostIndex.categories = postIndex.categories;
            oldPostIndex.link = postIndex.link;
            oldPostIndex.permalink = postIndex.permalink;
        }
        else {
            postIndex.id = this.indexId;
            this.postIndexs.push(postIndex);
        }

        this.savePostIndexs();
        return postIndex;
    }

    private updataOrAddIndex(postIndex: PostIndexInfo) {
        let oldPostIndex = this.postIndexs.find(p => p.id === postIndex.id);
        if (oldPostIndex) {
            oldPostIndex.postid = postIndex.postid;
            oldPostIndex.title = postIndex.title;
            oldPostIndex.remoteTitle = postIndex.remoteTitle;
            oldPostIndex.categories = postIndex.categories;
            oldPostIndex.link = postIndex.link;
            oldPostIndex.permalink = postIndex.permalink;
        }
        else {
            this.postIndexs.push(postIndex);
        }

        this.savePostIndexs();
    }

    /**
     * 根据文章文件填补索引
     * @param postIndexs 
     */
    private fillPostIndex(): void {
        this.readPostFiles()
            .filter(postFile => !this.hasIndexByTitle(postFile.title))
            .forEach(postFile => {
                this.updateOrAddPostIndex({
                    id: 0,
                    postid: 0,
                    title: postFile.title,
                });
            });
    }

    /**
     * 读取文章索引的内容，并合并文件信息
     */
    private postBaseInfosByIndex(): Array<PostBaseInfo> {
        return this.postIndexs.map<PostBaseInfo>(postIndex => {
            let blogPostFile = new BlogPostFile(postIndex);
            let postBaseInfo: PostBaseInfo = {
                id: postIndex.id,
                postId: postIndex.postid,
                title: postIndex.title,
                remoteTitle: postIndex.remoteTitle,
                categories: postIndex.categories,
                link: postIndex.link,
                permalink: postIndex.permalink,
                state: blogPostFile.postState(),
                fsPath: blogPostFile.postPath,
                remotePath: blogPostFile.remotePostPath
            };
            return postBaseInfo;
        });
    }

    /**
     * 获取文章的文件列表
     * @param folderPath 
     */
    private readPostFiles(): Array<PostFile> {
        let folderPath = this.folderPath;
        let postFiles = new Array<PostFile>();
        const children = fs.readdirSync(folderPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(folderPath, child);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                let lastIndex = child.lastIndexOf('.');
                let childSub = child.substring(0, lastIndex);
                lastIndex = childSub.lastIndexOf('.');
                postFiles.push({
                    title: this.titleDecodeURI(childSub.substring(0, lastIndex)),
                    fsPath: filePath
                });
            }
        }
        return postFiles;
    }

    /**
     * 解码不符合文件名称的标题
     */
    private titleDecodeURI(title:string): string{
        return decodeURIComponent(title)
    }

    /**
     * 读取本地的文章列表
     */
    public readPosts(): Array<PostBaseInfo> {
        let postBaseInfos = new Array<PostBaseInfo>();
        if (blogWorkspace.hasWorkspace) {

            this.fillPostIndex();

            postBaseInfos.push(...this.postBaseInfosByIndex());
        }

        return postBaseInfos;
    }

    /**
     * 更新多个文章到本地
     * @param posts 
     */
    public async pullPosts(posts: Array<PostStruct>): Promise<void> {
        if (await blogWorkspace.tryCreateBlogWorkspace()) {
            for (let index = 0; index < posts.length; index++) {
                await this.pullPost(posts[index]);
            }
        }
    }

    /**
     * 根据postid创建一个BlogPostFile
     * @param postId 
     */
    private createBlogPostFileByPostId(postId: string): BlogPostFile {
        let postIndex = this.postIndexs.find(p => p.postid === postId.toString());
        if (!postIndex || !postId) {
            postIndex = { id: this.indexId, postid: postId, title: "" };
        }

        return new BlogPostFile(postIndex);
    }

    /**
     * 根据id创建一个BlogPostFile
     * @param id 
     */
    private createBlogPostFileById(id: number): BlogPostFile {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (!postIndex) {
            throw new Error("该文章不存在");
        }
        return new BlogPostFile(postIndex);
    }

    /**
     * 更新一个文章到本地
     * @param post 
     */
    public async pullPost(post: PostStruct): Promise<void> {
        let blogPostFile = this.createBlogPostFileByPostId(post.postid);
        let description = await postImageReplace.toLocal(post.description);

        blogPostFile.updatePost(post.title, description);
        blogPostFile.updateRemotePost(post.title, description);
        blogPostFile.updateCategories(post.categories);

        let postIndex: PostIndexInfo = {
            ...blogPostFile.getPostIndexInfo(),
            link: post.link,
            permalink: post.permalink
        };

        this.updataOrAddIndex(postIndex);
    }

    /**
     * 新建一个文章
     * @param title 
     */
    public createPost(title: string): void {

        if (this.hasIndexByTitle(title)) {
            throw new Error("不能相同标题");
        }

        let blogPostFile = this.createBlogPostFileByPostId("");

        blogPostFile.create(title);

        this.updataOrAddIndex(blogPostFile.getPostIndexInfo());
    }

    /**
   * 重命名标题
   * @param postBaseInfo 
   * @param newTitle 
   */
    public renameTitle(postBaseInfo: PostBaseInfo, newTitle: string): string | undefined {
        if (this.hasIndexByTitle(newTitle)) {
            throw new Error("不能相同标题");
        }

        let blogPostFile = this.createBlogPostFileById(postBaseInfo.id);
        blogPostFile.rename(newTitle);
        this.updataOrAddIndex(blogPostFile.getPostIndexInfo());

        return blogPostFile.postPath;
    }

    /**
     * 查找文章
     * @param id 
     */
    public async getPost(id: number): Promise<PostStruct> {
        let blogPostFile = this.createBlogPostFileById(id);
        let postIndex = blogPostFile.getPostIndexInfo();
        let description = await postImageReplace.toRemote(blogPostFile.description());
        let categories: string[] = postIndex.categories ? postIndex.categories : [];

        if (!categories.includes("[Markdown]")) {
            categories.push("[Markdown]");
        }

        let post: PostStruct = {
            postid: postIndex.postid,
            title: postIndex.title,
            description: description,
            categories: categories
        };
        return post;
    }

    /**
     * 
     * @param postId 
     * @param id 
     */
    public updatePostId(postId: string, id: number): void {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            postIndex.postid = postId;
            this.updataOrAddIndex(postIndex);
        }
    }

    /**
     * 删除文章
     * @param postBaseInfo 
     */
    public deletePost(postBaseInfo: PostBaseInfo): void {
        let index = this.postIndexs.findIndex(p => p.id === postBaseInfo.id);
        if (index !== -1) {
            let blogPostFile = new BlogPostFile(this.postIndexs[index]);
            blogPostFile.delete();
            this.postIndexs.splice(index, 1);
            this.savePostIndexs();
        }
    }

    /**
     * 添加一个或者多个分类
     * @param id 
     * @param categories 
     */
    public addCategories(id: number, categories: string[]) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            if (postIndex.categories) {
                postIndex.categories.push(...categories);
            } else {
                postIndex.categories = categories;
            }
            this.updataOrAddIndex(postIndex);
        }
    }

    /**
     * 删除一个分类
     * @param id 
     * @param category 
     */
    public removeCategory(id: number, category: string) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            if (postIndex.categories) {
                let index = postIndex.categories.indexOf(category);
                postIndex.categories.splice(index, 1);
                this.updataOrAddIndex(postIndex);
            }
        }
    }
}

export const blogFile: BlogFile = new BlogFile();