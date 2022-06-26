import { TreeItemLabel } from "vscode";

export interface MethodCall {
    methodName: string;
    params: any;
}

/**
 * 包含用户名和密码
 */
export interface UserInfoParam {
    username: string;
    password: string;
}
/**
 * blogger.deletePost
 * Deletes a post.
 */
export interface DeletePostParam extends UserInfoParam {
    appKey: string;
    postid: string;
    publish: Boolean;
}

/**
 * blogger.getUsersBlogs
 * 获取用户相关的博客信息
 */
export interface GetUsersBlogsParam extends UserInfoParam {
    appKey: string;
}

/**
 * metaWeblog.editPost
 * 更新现有的博客文章
 */
export interface EditPostParam extends UserInfoParam {
    postid: string;
    post: PostStruct;
    publish: Boolean;
}

/**
 * metaWeblog.getCategories
 * 获取文章的有效类别列表
 */
export interface GetCategoriesParam extends UserInfoParam {
    blogid: string;
}

/**
 * metaWeblog.getPost
 * 获取现有文章
 */
export interface GetPostParam extends UserInfoParam {
    postid: string;
}

/**
 * metaWeblog.getRecentPosts
 * 获取最近帖子
 */
export interface GetRecentPostsParam extends UserInfoParam {
    blogid: string;
    numberOfPosts: Number;
}

/**
 * metaWeblog.newMediaObject
 * 上传文件到指定博客
 */
export interface NewMediaObjectParam extends UserInfoParam {
    blogid: string;
    file: FileDataStruct;
}

/**
 * metaWeblog.newPost
 * 新建文章到指定博客
 */
export interface NewPostParam extends UserInfoParam {
    blogid: string;
    post: PostStruct;
    publish: Boolean;
}

/**
 * wp.newCategory
 * 新建目录到指定博客
 */
export interface NewCategoryParam extends UserInfoParam {
    blog_id: string;
    category: WpCategoryStruct;
}

/**
 * 个人博客的基本信息的结果
 */
export interface BlogInfoStruct {
    blogid: string;
    url: string;
    blogName: string;
}

/**
 * struct Post
 * 博客文章的结构
 */
export interface PostStruct {
    description: string;
    title: string;
    categories?: (string | TreeItemLabel)[];
    dateCreated?: Date;
    enclosure?: EnclosureStruct;
    link?: string;
    permalink?: string;
    postid?: any;
    source?: SourceStruct;
    userid?: string;
    mt_allow_comments?: any;
    mt_allow_pings?: any;
    mt_convert_breaks?: any;
    mt_text_more?: string;
    mt_excerpt?: string;
    mt_keywords?: string;
    wp_slug?: string;
}

export interface CategoryInfoStruct {
    description: string;
    htmlUrl: string;
    rssUrl: string;
    title: string;
    categoryid: string;
}

export interface FileDataStruct {
    bits: Buffer;//base64
    name: string;
    type: string;
}

export interface UrlDataStruct {
    url: string;
}

export interface WpCategoryStruct {
    name: string;
    slug?: string;
    parent_id: Number;
    description?: string;
}

export interface EnclosureStruct {
    length?: Number;
    type?: string;
    url?: string;
}

export interface SourceStruct {
    name?: string;
    url?: string;
}