import {
    DeletePostParam,
    GetUsersBlogsParam,
    BlogInfoStruct,
    EditPostParam,
    CategoryInfoStruct,
    GetCategoriesParam,
    GetPostParam,
    PostStruct,
    GetRecentPostsParam,
    UrlDataStruct,
    NewMediaObjectParam,
    NewPostParam,
    NewCategoryParam
} from "./rpc-package";
import { RpcXmlSerialize } from "./rpc-xml-serialize";
import { RpcXmlDeserialize } from "./rpc-xml-deserialize";

const request = require('request');

export class RpcClient {

    private rpcXmlSerialize: RpcXmlSerialize = new RpcXmlSerialize();
    private rpcXmlDeserialize: RpcXmlDeserialize = new RpcXmlDeserialize();

    constructor(private rpc_url: String) { }

    /**
     * blogger.deletePost
     * 删除一个文章
     * @param param 
     */
    async deletePost(param: DeletePostParam): Promise<Boolean> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'blogger.deletePost',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeBoolean(result);
    }

    /**
     * blogger.getUsersBlogs
     * 获取用户的博客信息,返回BlogInfoStruct
     * @param param 
     */
    async getUsersBlogs(param: GetUsersBlogsParam): Promise<BlogInfoStruct> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'blogger.getUsersBlogs',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeBlogInfoStruct(result);
    }

    /**
     * metaWeblog.editPost
     * 更新现有的博客文章
     * @param param 
     */
    async editPost(param: EditPostParam): Promise<Boolean> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.editPost',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeBoolean(result);
    }

    /**
    * metaWeblog.getCategories
    * 获取文章的有效类别列表
    * @param param 
    */
    async getCategories(param: GetCategoriesParam): Promise<Array<CategoryInfoStruct>> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getCategories',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeCategoryInfoStructArray(result);
    }

    /**
    * metaWeblog.getPost
    * 获取现有文章
    * @param param 
    */
    async getPost(param: GetPostParam): Promise<PostStruct> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getPost',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializePostStruct(result);
    }

    /**
    * metaWeblog.getRecentPosts
    * 获取最近帖子
    * @param param 
    */
    async getRecentPosts(param: GetRecentPostsParam): Promise<Array<PostStruct>> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getRecentPosts',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializePostStructArray(result);
    }

    /**
    * metaWeblog.newMediaObject
    * 上传文件到指定博客
    * @param param 
    */
    async newMediaObject(param: NewMediaObjectParam): Promise<UrlDataStruct> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.newMediaObject',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeUrlDataStruct(result);
    }

    /**
    * metaWeblog.newPost
    * 新建文章到指定博客
    * @param param 
    */
    async newPost(param: NewPostParam): Promise<String> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.newPost',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeString(result);
    }

    /**
    * wp.newCategory
    * 新建目录到指定博客
    * @param param 
    */
    async newCategory(param: NewCategoryParam): Promise<Number> {
        let data = this.rpcXmlSerialize.serialize({
            methodName: 'wp.newCategory',
            params: param
        });

        let result = await this.postRequest(data);
        return await this.rpcXmlDeserialize.deserializeNumber(result);
    }

    /**
     * 提交请求
     * @param xml 
     */
    private postRequest(xml: String): Promise<any> {

        let options = {
            url: this.rpc_url,
            headers: '{Content-Type:application/xml}',
            method: 'post',
            body: xml
        };

        return new Promise<any>((resolve, reject) => {
            request(options, function (error: any, response: any, body: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }
}