'use strict';

import * as fs from 'fs';
import * as path from 'path';

export class ImageToBase64 {

    convertFile(fileUrl:string) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let fileInfo = that.fileInfo(fileUrl);
            
            if(!fileInfo.name){
                return reject("上传的不是图片，只支持png,jpg,gif");
            }
            
            fs.readFile(fileUrl, 'binary', function (err, imageData) {
                if (err) {
                    return reject(err.message);
                }
                var base64Image = new Buffer(imageData, 'binary');
                fileInfo["bits"] = base64Image;
                return resolve(fileInfo);
            });
        });
    }
    
    private fileInfo(fileUrl:string):any{
        let fileInfo :{[key: string]: string;}={};
        let imageTypeExtensions = ['png','jpg','gif'];
        imageTypeExtensions.forEach(extensionName=>{
            let extname = path.extname(fileUrl);
            if (extname.endsWith(extensionName)) {
                fileInfo["type"] = `image/${extensionName}`;
                fileInfo["name"] = path.basename(fileUrl);
                return;
            }
        });
        
        return fileInfo;
    }

}