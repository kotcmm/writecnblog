export interface MethodCall {
    methodName: String;
    params: any;
}
/**
 * 包含用户名和密码
 */
export interface UserInfoParam {
    username: String;
    password: String;
}
/**
 * blogger.deletePost
 * Deletes a post.
 */
export interface DeletePostParam extends UserInfoParam {
    appKey: String;
    postid: String;
    publish: Boolean;
}

/**
 * blogger.getUsersBlogs
 * 获取用户相关的博客信息
 */
export interface GetUsersBlogsParam extends UserInfoParam {
    appKey: String;
}

/**
 * metaWeblog.editPost
 * 更新现有的博客文章
 */
export interface EditPostParam extends UserInfoParam {
    postid: String;
    post: PostStruct;
    publish: Boolean;
}

/**
 * metaWeblog.getCategories
 * 获取文章的有效类别列表
 */
export interface GetCategoriesParam extends UserInfoParam {
    blogid: String;
}

/**
 * metaWeblog.getPost
 * 获取现有文章
 */
export interface GetPostParam extends UserInfoParam {
    postid: String;
}

/**
 * metaWeblog.getRecentPosts
 * 获取最近帖子
 */
export interface GetRecentPostsParam extends UserInfoParam {
    blogid: String;
    numberOfPosts: Number;
}

/**
 * metaWeblog.newMediaObject
 * 上传文件到指定博客
 */
export interface NewMediaObjectParam extends UserInfoParam {
    blogid: String;
    file: FileDataStruct;
}

/**
 * metaWeblog.newPost
 * 新建文章到指定博客
 */
export interface NewPostParam extends UserInfoParam {
    blogid: String;
    post: PostStruct;
    publish: Boolean;
}

/**
 * wp.newCategory
 * 新建目录到指定博客
 */
export interface NewCategoryParam extends UserInfoParam {
    blog_id: String;
    post: PostStruct;
    publish: Boolean;
    category: WpCategoryStruct;
}

export interface BlogInfoStruct {
    blogid: String;
    url: String;
    blogName: String;
}

/**
 * struct Post
 * 博客文章的结构
 */
export interface PostStruct {
    dateCreated: Date;
    description: String;
    title: String;
    categories?: String[];
    enclosure?: EnclosureStruct;
    link?: String;
    permalink?: String;
    postid?: any;
    source?: SourceStruct;
    userid?: String;
    mt_allow_comments?: any;
    mt_allow_pings?: any;
    mt_convert_breaks?: any;
    mt_text_more?: String;
    mt_excerpt?: String;
    mt_keywords?: String;
    wp_slug?: String;
}

export interface CategoryInfoStruct {
    description: String;
    htmlUrl: String;
    rssUrl: String;
    title: String;
    categoryid: String;
}

export interface FileDataStruct {
    bits: Buffer;//base64
    name: String;
    type: String;
}

export interface UrlDataStruct {
    url: String;
}

export interface WpCategoryStruct {
    name: String;
    slug?: String;
    parent_id: Number;
    description?: String;
}

export interface EnclosureStruct {
    length?: Number;
    type?: String;
    url?: String;
}

export interface SourceStruct {
    name?: String;
    url?: String;
}