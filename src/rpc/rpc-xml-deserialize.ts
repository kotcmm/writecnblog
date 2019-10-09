import { BlogInfoStruct, CategoryInfoStruct } from "./rpc-package";

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
        let members = result[0].param[0].value[0]
            .array[0].data[0].value[0].struct[0].member;

        return this.buildStruct(members);
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
            array.push(this.buildStruct(element.struct[0].member));
        });

        return array;
    }

    /**
     * 构建一个结构体的值对象
     * @param members 
     */
    private buildStruct(members: any): any {
        let struct: any = {};
        members.forEach((element: any) => {
            let name = element.name[0];
            let data = this.getValueData(element.value[0]);
            struct[name] = data;
        });

        return struct;
    }

    /**
     * 获取值
     * @param value 
     */
    private getValueData(value: any): any {
        for (let name in value) {
            return value[name][0];
        }
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
        let members = fault[0].value[0].struct[0].member;

        return this.buildStruct(members).faultString;
    }
}