import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
const request = require('request');

const regexp = /!\[(.*?)\]\((.*?)\)/g;
const urlRegexp = /(?<=\()[\S]+(?=\))/g;
const imageDirName = "images";
/**
 * 替换文章中的图片。
 * 远程地址替换成本地地址
 * 本地地址替换为远端地址
 */
export class PostImageReplace {

    constructor(private folderPath:string){

    }

    public toLocal(post: string): string {
        let images = post.match(regexp);
        let newPost = post;
        //TODO:对比本地是否存在，下载图片，替换地址
        if (images) {
            images.forEach(image => {
                let urls = image.match(urlRegexp);
                if (urls) {
                   let localPath = this.imageDown(urls[0]);
                   newPost = newPost.replace(image,image.replace(urls[0],localPath));
                }
            });
        }
        return newPost;
    }

    /**
    * 提交请求
    * @param url 
    */
    private imageDown(url: string): string {
        let extName = path.extname(url);
        mkdirp.sync(path.join(this.folderPath, imageDirName));
        let imagePath = path.join(imageDirName,`${Date.now().toString()}${extName}`);
        request.get(url)
            .pipe(fs.createWriteStream(path.join(this.folderPath,imagePath)));

        return imagePath;
    }
}