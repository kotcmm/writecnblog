"use strict";

import {Xmlrpc} from './xmlrpc'

export class Metaweblog{
    private _xmlrpc : Xmlrpc;
    constructor(rpc_url : string){
        this._xmlrpc = new Xmlrpc(rpc_url);
    }
    
    deletePost(appKey:string, postid:string, username:string, password:string, publish:boolean){
        
    }
    
    getUsersBlogs(appKey:string, username:string, password:string){
        
    }
    
    getPost(postid:string, username:string, password:string,callBack){
        this._xmlrpc.send("metaWeblog.getPost",postid,username,password,callBack);
    }
    
    getRecentPosts(blogid:string, username:string, password:string,	numberOfPosts:Number,callBack){
        this._xmlrpc.send("metaWeblog.getRecentPosts",blogid,username,password,numberOfPosts,callBack);
    }
    
    newPos(blogid:string, username:string, password:string, post:Object, publish:boolean,callBack){
        this._xmlrpc.send("metaWeblog.newPost",blogid,username,password,post,publish,callBack);
    }
}