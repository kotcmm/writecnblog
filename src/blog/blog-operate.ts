import { BlogConfig, AppKey, blogConfig } from "./blog-config";
import { RpcClient } from "../rpc/rpc-client";
import { UserInfoParam, PostStruct, CategoryInfoStruct, BlogInfoStruct } from "../rpc/rpc-package";

export class BlogOperate {

    private _rpcClient: RpcClient | undefined;
    private get rpcClient(): RpcClient {
        if (this._rpcClient) {
            return this._rpcClient;
        }
        let rpcUrl = this.config.rpcUrl();
        if (rpcUrl) {
            this._rpcClient = new RpcClient(rpcUrl);
            return this._rpcClient;
        }

        throw new Error("请配置MetaWeblog访问地址");
    }

    private get config(): BlogConfig {
        return blogConfig;
    }

    private get blogId() {
        let blogId = this.config.blogId;
        if (!blogId) {
            throw new Error("请配博客Id");
        }
        return blogId;
    }

    /**
    * 从配置文件里面获取用户名和密码
    */
    async userInfo(): Promise<UserInfoParam> {
        let userName = this.config.userName();
        if (!userName) {
            throw new Error("请配置用户名");
        }

        let password = await this.config.password();
        if (!password) {
            throw new Error("请配置密码");
        }

        return {
            username: userName!,
            password: password
        };
    }

    /**
     * 获取博客的信息
     * @param rpcUrl 
     * @param userInfo 
     */
    async blogInfo(rpcUrl: string, userInfo: UserInfoParam): Promise<BlogInfoStruct> {
        let rpcClient = new RpcClient(rpcUrl);
        return await rpcClient.getUsersBlogs({
            appKey: AppKey,
            ...userInfo,
        });
    }

    /**
     * 获取最近文章
     * @param numberOfPosts 总共要获取多少
     */
    async getRecentPosts(numberOfPosts: Number): Promise<Array<PostStruct>> {
        return await this.rpcClient.getRecentPosts({
            blogid: this.blogId,
            ...await this.userInfo(),
            numberOfPosts: numberOfPosts,
        });
    }

    /**
     * 发布新文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    async newPos(post: PostStruct, publish: Boolean): Promise<string> {
        return await this.rpcClient.newPost({
            blogid: this.blogId,
            ...await this.userInfo(),
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
            ...await this.userInfo(),
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
            ...await this.userInfo(),
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
            ...await this.userInfo(),
            publish: publish,
        });
    }

    /**
     * 获取分类目录列表
     */
    async getCategories(): Promise<Array<CategoryInfoStruct>> {
        return await this.rpcClient.getCategories({
            blogid: this.blogId,
            ...await this.userInfo(),
        });
    }

    /**
     * 新建分类
     * @param categoryName 
     */
    async newCategory(categoryName: string) {
        await this.rpcClient.newCategory({
            blog_id: this.blogId,
            ...await this.userInfo(),
            category: {
                name: categoryName,
                parent_id: 0,
                slug: "[随笔分类]"
            }
        });
    }

    /**
     * 上传图片，并返回图片地址
     * @param bits 
     * @param type 
     * @param name 
     */
    async newMediaObject(bits: Buffer, type: string, name: string): Promise<string> {
        let urlData = await this.rpcClient.newMediaObject({
            blogid: this.blogId,
            ...await this.userInfo(),
            file: {
                name: name,
                type: type,
                bits: bits
            }
        });

        return urlData.url;
    }
}

export const blogOperate = new BlogOperate();