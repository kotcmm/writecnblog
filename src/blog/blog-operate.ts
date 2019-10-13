import { BlogConfig, AppKey } from "./blog-config";
import { RpcClient } from "../rpc/rpc-client";
import { UserInfoParam, BlogInfoStruct, PostStruct } from "../rpc/rpc-package";
import { PostStructBuilder } from "./poststruct-builder";

export class BlogOperate {

    config: BlogConfig;
    rpcClient: RpcClient;
    postStructBuilder: PostStructBuilder;

    constructor() {
        this.config = new BlogConfig();
        this.rpcClient = new RpcClient(this.config.rpcUrl);
        this.postStructBuilder = new PostStructBuilder();
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
     * @param publish true为发布文章，false为保存草稿
     */
    async newPos(publish: Boolean) {

        let blogInfo = await this.blogInfo();

        await this.rpcClient.newPost({
            blogid: blogInfo.blogid,
            ...this.userInfo,
            post: this.postStructBuilder.build(),
            publish: publish,
        });
    }
}