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

export class RpcClient {
    /**
     * blogger.deletePost
     * 删除一个文章
     * @param param 
     */
    deletePost(param: DeletePostParam): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {

        });
    }

    /**
     * blogger.getUsersBlogs
     * 获取用户的博客信息,返回BlogInfoStruct
     * @param param 
     */
    getUsersBlogs(param: GetUsersBlogsParam): Promise<BlogInfoStruct> {
        return new Promise<BlogInfoStruct>((resolve, reject) => {

        });
    }

    /**
     * metaWeblog.editPost
     * 更新现有的博客文章
     * @param param 
     */
    editPost(param: EditPostParam): Promise<any> {
        return new Promise<any>((resolve, reject) => {

        });
    }

    /**
    * metaWeblog.getCategories
    * 获取文章的有效类别列表
    * @param param 
    */
    getCategories(param: GetCategoriesParam): Promise<CategoryInfoStruct> {
        return new Promise<CategoryInfoStruct>((resolve, reject) => {

        });
    }

    /**
    * metaWeblog.getPost
    * 获取现有文章
    * @param param 
    */
    getPost(param: GetPostParam): Promise<PostStruct> {
        return new Promise<PostStruct>((resolve, reject) => {

        });
    }

    /**
    * metaWeblog.getRecentPosts
    * 获取最近帖子
    * @param param 
    */
    getRecentPosts(param: GetRecentPostsParam): Promise<Array<PostStruct>> {
        return new Promise<Array<PostStruct>>((resolve, reject) => {

        });
    }

    /**
    * metaWeblog.newMediaObject
    * 上传文件到指定博客
    * @param param 
    */
    newMediaObject(param: NewMediaObjectParam): Promise<UrlDataStruct> {
        return new Promise<UrlDataStruct>((resolve, reject) => {

        });
    }

    /**
    * metaWeblog.newPost
    * 新建文章到指定博客
    * @param param 
    */
    newPost(param: NewPostParam): Promise<String> {
        return new Promise<String>((resolve, reject) => {

        });
    }

    /**
    * wp.newCategory
    * 新建目录到指定博客
    * @param param 
    */
    newCategory(param: NewCategoryParam): Promise<Number> {
        return new Promise<Number>((resolve, reject) => {

        });
    }
}