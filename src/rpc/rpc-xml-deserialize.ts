import { BlogInfoStruct, CategoryInfoStruct, PostStruct, UrlDataStruct } from "./rpc-package";

var moment = require('moment');
const xml2js = require('xml2js');

export class RpcXmlDeserialize {

    /**
     * 反序列化结果为Boolean
     * @param data 
     */
    async deserializeBoolean(data: String): Promise<Boolean> {
        let result = await this.deserializeObject<Boolean>(data);
        return result;
    }

    /**
     * 反序列化结果为String
     * @param data 
     */
    async deserializeString(data: String): Promise<String> {
        let result = await this.deserializeObject<String>(data);
        return result;
    }

    /**
    * 反序列化结果为Number
    * @param data 
    */
    async deserializeNumber(data: String): Promise<Number> {
        let result = await this.deserializeObject<Number>(data);
        return result;
    }

    /**
     * 反序列化结果为BlogInfoStruct
     * @param data 
     */
    async deserializeBlogInfoStruct(data: String): Promise<BlogInfoStruct> {
        let result = await this.deserializeObject<Array<BlogInfoStruct>>(data);
        return result[0];
    }

    /**
     * 反序列化结果为Array<CategoryInfoStruct>
     * @param data 
     */
    async deserializeCategoryInfoStructArray(data: String): Promise<Array<CategoryInfoStruct>> {
        let result = await this.deserializeObject<Array<CategoryInfoStruct>>(data);
        return result;
    }

    /**
     * 反序列化结果为PostStruct
     * @param data 
     */
    async deserializePostStruct(data: String): Promise<PostStruct> {
        let result = await this.deserializeObject<PostStruct>(data);
        return result;
    }

    /**
     * 反序列化结果为Array<PostStruct>
     * @param data 
     */
    async deserializePostStructArray(data: String): Promise<Array<PostStruct>> {
        let result = await this.deserializeObject<Array<PostStruct>>(data);
        return result;
    }

    /**
     * 反序列化结果为UrlDataStruct
     * @param data 
     */
    async deserializeUrlDataStruct(data: String): Promise<UrlDataStruct> {
        let result = await this.deserializeObject<UrlDataStruct>(data);
        return result;
    }

    /**
     * 获取值
     * @param obj 
     */
    private getValueData(obj: any): any {
        for (let name in obj) {
            switch (name) {
                case 'array':
                    return this.getArrayValueData(obj[name]);
                case 'struct':
                    return this.getStructValueData(obj[name]);
                case 'i4':
                    return +obj[name][0];
                case 'boolean':
                    return obj[name][0] !== '0';
                case 'dateTime.iso8601':
                    return new Date(moment(obj[name][0], 'YYYYMMDDThh:mm:ss'));
                default:
                    return obj[name][0];
            }
        }
    }

    /**
     * 获取值为array
     * @param arrayObj 
     */
    private getArrayValueData(arrayObj: any): any {
        let array: Array<any> = new Array<any>();
        arrayObj[0].data[0].value.forEach((element: any) => {
            let data = this.getValueData(element);
            array.push(data);
        });
        return array;
    }

    /**
    * 获取值为struct
    * @param structObj 
    */
    private getStructValueData(structObj: any): any {
        let struct: any = {};
        if (structObj[0].member) {
            structObj[0].member.forEach((element: any) => {
                let name = element.name[0];
                let data = this.getValueData(element.value[0]);
                struct[name] = data;
            });
        }
        return struct;
    }

    /**
     * 反序列化xml，提取参数，如果错误抛出异常
     * @param data 
     */
    async deserializeObject<T>(data: String): Promise<T> {
        let parser = new xml2js.Parser();
        let result = await parser.parseStringPromise(data);
        if (result.methodResponse.params) {
            let value = result.methodResponse.params[0].param[0].value[0];
            return this.getValueData(value);
        }
        let faultString = this.faultString(result.methodResponse.fault);

        throw new Error(faultString);
    }

    private faultString(fault: any): string {
        let value = fault[0].value[0];

        return this.getValueData(value).faultString;
    }
}