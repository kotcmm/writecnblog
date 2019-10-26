import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { imageDirName, blogDirName, imageIndexName } from '../constants';
import { blogWorkspace } from './blog-workspace';
import { blogOperate } from './blog-operate';
const request = require('request');

const regexp = /!\[(.*?)\]\((.*?)\)/g;
const urlRegexp = /(?<=\()[\S]+(?=\))/g;
const httpRegexp = /(http|https):\/\/([\w.]+\/?)\S*/g;

/**
 * 替换文章中的图片。
 * 远程地址替换成本地地址
 * 本地地址替换为远端地址
 */
export class PostImageReplace {

    /**
     * 博客工作目录
     */
    private get folderPath(): string {
        return blogWorkspace.folderPath;
    }

    /**
     * 本地地址转换为网络地址
     * @param post 
     */
    public async toRemote(post: string): Promise<string> {
        let images = post.match(regexp);
        if (!images) { return post; }

        let newPost = post;
        let imageIndexs = this.readIndex();
        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            let urls = image.match(urlRegexp);
            if (urls) {
                let imageUrl = urls[0];
                if (imageUrl.match(httpRegexp)) {
                    continue;
                }
                let imageIndex = imageIndexs.find(ii => ii.local === imageUrl);
                let remotePath = imageIndex ? imageIndex.remote : await this.imageUpload(imageUrl);
                if (remotePath) {
                    newPost = newPost.replace(image, image.replace(imageUrl, remotePath));
                    if (!imageIndex) {
                        imageIndexs.push({ local: imageUrl, remote: remotePath });
                    }
                }
            }
        }
        this.saveIndex(imageIndexs);
        return newPost;
    }

    /**
     * 提交请求
     * @param fileName 
     */
    private async imageUpload(fileName: string): Promise<string | undefined> {
        let imagePath = path.join(this.folderPath, fileName);
        if (fs.existsSync(imagePath)) {
            let imageData = fs.readFileSync(imagePath);
            let extname = path.extname(imagePath);
            let name = path.basename(imagePath);
            let type = `image/${extname.substr(0, extname.length - 1)}`;
            return await blogOperate.newMediaObject(imageData, type, name);
        }

        return undefined;
    }

    /**
     * 图片远端地址转换本地地址
     * @param post 
     */
    public async toLocal(post: string): Promise<string> {
        let images = post.match(regexp);
        if (!images) { return post; }
        let newPost = post;
        let imageIndexs = this.readIndex();
        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            let urls = image.match(urlRegexp);
            if (urls) {
                let imageUrl = urls[0];
                let imageIndex = imageIndexs.find(ii => ii.remote === imageUrl);
                let localPath = imageIndex ? imageIndex.local : await this.imageDown(imageUrl);
                newPost = newPost.replace(image, image.replace(imageUrl, localPath));
                if (!imageIndex) {
                    imageIndexs.push({ local: localPath, remote: imageUrl });
                }
            }
        }
        this.saveIndex(imageIndexs);
        return newPost;
    }

    /**
    * 提交请求
    * @param url 
    */
    private imageDown(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let extName = path.extname(url);
            mkdirp.sync(path.join(this.folderPath, imageDirName));
            let imagePath = path.join(imageDirName, `${Date.now().toString()}${extName}`);

            request.get(url)
                .pipe(fs.createWriteStream(path.join(this.folderPath, imagePath)))
                .on('finish', function () {
                    resolve(imagePath);
                }).on('error', function (error: any) {
                    reject(error);
                });
        });
    }

    /**
     * 读取图片索引
     */
    private readIndex(): ImageIndexInfo[] {
        let indexPath = path.join(this.folderPath, blogDirName, imageIndexName);
        if (fs.existsSync(indexPath)) {
            let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
            let imageFiles: Array<string> = this.readImageFiles();
            let imageIndexs = JSON.parse(context) as ImageIndexInfo[];

            return imageIndexs.filter(ii => imageFiles.includes(ii.local));
        }
        return new Array<ImageIndexInfo>();
    }

    /**
     * 保存文件索引
     * @param imageIndexs 
     */
    private saveIndex(imageIndexs: Array<ImageIndexInfo>): void {
        let indexPath = path.join(this.folderPath, blogDirName, imageIndexName);
        fs.writeFileSync(indexPath, JSON.stringify(imageIndexs));
    }

    /**
     * 获取本地图片路径
     * @param uri 
     */
    private readImageFiles(): Array<string> {
        let imageDir = path.join(this.folderPath, imageDirName);

        if (!fs.existsSync(imageDir)) {
            return new Array<string>();
        }

        let postFiles = new Array<string>();
        const children = fs.readdirSync(imageDir);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(imageDir, child);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                postFiles.push(path.join(imageDirName, child));
            }
        }
        return postFiles;
    }
}

export const postImageReplace: PostImageReplace = new PostImageReplace();

export interface ImageIndexInfo {
    local: string;
    remote: string;
}
