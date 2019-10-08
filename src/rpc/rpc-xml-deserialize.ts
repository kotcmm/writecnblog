const xml2js = require('xml2js');

export class RpcXmlDeserialize {
    
    async deserializeObject(data: String): Promise<any> {
        var parser = new xml2js.Parser();
        var result = await parser.parseStringPromise(data);
        if(result.params){
            this.getParamValues(result.params);
        }
        return {};
    }

    /**
     * 获取全部参数的值
     * @param data 
     */
    private getParamValues(params: any): Array<any> {

        return new Array<any>();
    }
}