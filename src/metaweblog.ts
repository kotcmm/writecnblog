"use strict";

import {Xmlrpc} from './xmlrpc';

export class Metaweblog{
    private _xmlrpc : Xmlrpc;
    constructor(rpc_url : string){
        this._xmlrpc = new Xmlrpc(rpc_url);
    }
    
    deletePost(appKey:string, postid:string, username:string, password:string, publish:boolean){
        
    }
    
    getPost(postid:string, username:string, password:string,callBack: (backData: any) => void){
        this._xmlrpc.send("metaWeblog.getPost",postid,username,password,callBack);
    }
    getUsersBlogs(appKey:string, username:string, password:string,callBack: (backData: any) => void){
        this._xmlrpc.send("blogger.getUsersBlogs",appKey,username,password,callBack);
    }
    getRecentPosts(blogid:string, username:string, password:string,	numberOfPosts:Number,callBack: (backData: any, method: string) => void){
        this._xmlrpc.send("metaWeblog.getRecentPosts",blogid,username,password,numberOfPosts,callBack);
    }
    
    newMediaObject(blogid:string,username:string,password:string,file:Object,callBack: (backData: { faultCode: any; faultString: string; url: any; }) => void){
        this._xmlrpc.send("metaWeblog.newMediaObject",blogid,username,password,file,callBack);
    }
    
    newPos(blogid:string, username:string, password:string, post:Object, publish:boolean,callBack: (backData: any, method: string) => void){
        this._xmlrpc.send("metaWeblog.newPost",blogid,username,password,post,publish,callBack);
    }
    
    editPos(postid:string, username:string, password:string, post:Object, publish:boolean,callBack: (backData: any, method: string) => void){
        this._xmlrpc.send("metaWeblog.editPost",postid,username,password,post,publish,callBack);
    }
}