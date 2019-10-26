
export interface PostFile {
    title: string;
    fsPath: string;
}

export enum PostState {
    U = 0,//新建
    M = 1,//修改
    D = 2,//删除
    R = 3//正常
}

export interface PostBaseInfo {
    id: number;
    postId?: any;
    title: string;
    remoteTitle?: string;
    state: PostState;
    fsPath: string;
    remotePath?: string;
    categories?: Array<string>;
    link?: string;
    permalink?: string;
}

export interface PostIndexInfo {
    id: number;
    postid: any;
    title: string;
    remoteTitle?: string;
    categories?: Array<string>;
    link?: string;
    permalink?: string;
}
