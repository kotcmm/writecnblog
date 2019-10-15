
export interface PostFile {
    title: string;
    fsPath: string;
}

export enum PostState {
    U,//新建
    M,//修改
    D//删除
}

export interface PostBaseInfo {
    postId?: any;
    title: string;
    remoteTitle?: string;
    state?: PostState;
    fsPath?: string;
    remotePath?: string;
}

export interface PostIndexInfo {
    postid: any;
    title: string;
    remoteTitle?: string;
}
