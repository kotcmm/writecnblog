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
    
    newPos(blogid:string, username:string, password:string, post:Object, publish:boolean){
        this._xmlrpc.send("metaWeblog.newPost",blogid,username,password,post,publish);
    }
}