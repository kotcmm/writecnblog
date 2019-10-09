import { BlogInfoStruct, CategoryInfoStruct, PostStruct } from "./rpc-package";

const xml2js = require('xml2js');

export class RpcXmlDeserialize {

    /**
     * 反序列化结果为Boolean
     * @param data 
     */
    async deserializeBoolean(data: String): Promise<Boolean> {
        let result = await this.deserializeObject(data);
        return result[0].param[0].value[0].boolean[0] === '1';
    }

    /**
     * 反序列化结果为BlogInfoStruct
     * @param data 
     */
    async deserializeBlogInfoStruct(data: String): Promise<BlogInfoStruct> {
        let result = await this.deserializeObject(data);
        let value = result[0].param[0].value[0]
            .array[0].data[0].value;

        return this.getValueData(value);
    }

    /**
     * 反序列化结果为Array<CategoryInfoStruct>
     * @param data 
     */
    async deserializeCategoryInfoStruct(data: String): Promise<Array<CategoryInfoStruct>> {
        let result = await this.deserializeObject(data);
        let structs = result[0].param[0].value[0]
            .array[0].data[0].value;
        let array: Array<CategoryInfoStruct> = new Array<CategoryInfoStruct>();

        structs.forEach((element: any) => {
            array.push(this.getValueData(element));
        });

        return array;
    }

    /**
     * 反序列化结果为PostStruct
     * @param data 
     */
    async deserializePostStruct(data: String): Promise<PostStruct> {
        let result = await this.deserializeObject(data);
        let value = result[0].param[0].value;

        return this.getValueData(value);
    }

    /**
     * 获取值
     * @param value 
     */
    private getValueData(value: any): any {
        for (let name in value) {
            switch (name) {
                case 'array':
                    return this.getArrayValueData(value[name]);
                case 'struct':
                    return this.getStructValueData(value[name]);
                default:
                    return value[name][0];
            }
        }
    }

    /**
     * 获取值为array
     * @param value 
     */
    private getArrayValueData(value: any): any {
        let array: Array<any> = new Array<any>();
        value.forEach((element: any) => {
            var data = this.getValueData(element.data[0].value[0]);
            array.push(data);
        });
        return array;
    }

    /**
    * 获取值为struct
    * @param value 
    */
    private getStructValueData(value: any): any {
        let struct: any = {};
        value[0].member.forEach((element: any) => {
            let name = element.name[0];
            let data = this.getValueData(element.value[0]);
            struct[name] = data;
        });

        return struct;
    }

    /**
     * 反序列化xml，提取参数，如果错误抛出异常
     * @param data 
     */
    private async deserializeObject(data: String): Promise<any> {
        let parser = new xml2js.Parser();
        let result = await parser.parseStringPromise(data);
        if (result.methodResponse.params) {
            return result.methodResponse.params;
        }
        let faultString = this.faultString(result.methodResponse.fault);

        throw new Error(faultString);
    }

    private faultString(fault: any): string {
        let value = fault[0].value;

        return this.getValueData(value).faultString;
    }
}