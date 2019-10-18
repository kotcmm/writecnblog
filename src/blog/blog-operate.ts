import { BlogConfig, AppKey } from "./blog-config";
import { RpcClient } from "../rpc/rpc-client";
import { UserInfoParam, BlogInfoStruct, PostStruct, CategoryInfoStruct } from "../rpc/rpc-package";

export class BlogOperate {

    private config: BlogConfig;
    private rpcClient: RpcClient;

    constructor() {
        this.config = new BlogConfig();
        this.rpcClient = new RpcClient(this.config.rpcUrl);
    }

    /**
    * 从配置文件里面获取用户名和密码
    */
    get userInfo(): UserInfoParam {
        return {
            username: this.config.userName,
            password: this.config.passWord
        };
    }

    /**
     * 获取博客的信息
     */
    async blogInfo(): Promise<BlogInfoStruct> {
        return await this.rpcClient.getUsersBlogs({
            appKey: AppKey,
            ...this.userInfo,
        });
    }

    /**
     * 获取最近文章
     * @param numberOfPosts 总共要获取多少
     */
    async getRecentPosts(numberOfPosts: Number): Promise<Array<PostStruct>> {
        let blogInfo = await this.blogInfo();

        return await this.rpcClient.getRecentPosts({
            blogid: blogInfo.blogid,
            ...this.userInfo,
            numberOfPosts: numberOfPosts,
        });
    }

    /**
     * 发布新文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    async newPos(post: PostStruct, publish: Boolean): Promise<string> {

        let blogInfo = await this.blogInfo();

        return await this.rpcClient.newPost({
            blogid: blogInfo.blogid,
            ...this.userInfo,
            post: post,
            publish: publish,
        });
    }

    /**
     * 获取文章内容
     * @param postId 
     */
    async getPost(postId: string): Promise<PostStruct> {
        return await this.rpcClient.getPost({
            postid: postId,
            ...this.userInfo
        });
    }

    /**
     * 更新文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    async editPost(post: PostStruct, publish: Boolean) {
        await this.rpcClient.editPost({
            postid: post.postid,
            ...this.userInfo,
            post: post,
            publish: publish,
        });
    }

    /**
     * 删除文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    async deletePost(postid: string, publish: Boolean) {
        await this.rpcClient.deletePost({
            appKey: AppKey,
            postid: postid,
            ...this.userInfo,
            publish: publish,
        });
    }

    /**
     * 获取分类目录列表
     */
    async getCategories(): Promise<Array<CategoryInfoStruct>> {
        let blogInfo = await this.blogInfo();
        return await this.rpcClient.getCategories({
            blogid: blogInfo.blogid,
            ...this.userInfo
        });
    }

    /**
     * 新建分类
     * @param categoryName 
     */
    async newCategory(categoryName: string) {
        let blogInfo = await this.blogInfo();

        await this.rpcClient.newCategory({
            blog_id: blogInfo.blogid,
            ...this.userInfo,
            category: {
                name: categoryName,
                parent_id: 0,
                slug: "[随笔分类]"
            }
        });
    }
}

export const blogOperate = new BlogOperate();