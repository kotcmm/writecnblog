'use strict';

import * as fs from 'fs';

export class ImageToBase64 {

    convertFile(fileUrl) {
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
        fileUrl = fileUrl.replace(/\//g,'\\');
        let fileInfo = {};
        let imageTypeExtensions = ['png','jpg','gif'];
        imageTypeExtensions.forEach(extensionName=>{
            if (fileUrl.endsWith(extensionName)) {
                fileInfo["type"] = `image/${extensionName}`;
                let lastPoint = fileUrl.lastIndexOf('\\');
                if (lastPoint > 0) { lastPoint += 1; }
                else { lastPoint = 0; }
                fileInfo["name"] = fileUrl.substring(lastPoint, fileUrl.length);
                return;
            }
        });
        
        return fileInfo;
    }

}