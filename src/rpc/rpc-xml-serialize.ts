import { MethodCall } from "./rpc-package";

export class RpcXmlSerialize {

    serialize(value: MethodCall): string {
        let doc = new Array<string>();
        doc.push('<methodCall>');
        doc.push(`<methodName>${value.methodName}</methodName>`);
        if (value.params) {
            doc.push('<params>');
            for (let key in value.params) {
                if (value.params.hasOwnProperty(key)) {
                    let element = value.params[key];
                    if (element !== null) {
                        doc.push('<param><value>');
                        doc.push(this.paramBuild(element));
                        doc.push('</value></param>');
                    }
                }
            }
            doc.push('</params>');
        }
        doc.push('</methodCall>');
        return doc.join('');
    }

    /**
     * 构建参数序列化
     * @param param 
     */
    private paramBuild(param: any): string {
        switch (param.constructor.name) {
            case 'Array':
                return this.arrayBuild(param);
            case 'Object':
                return this.objectBuild(param);
            case 'Number':
                return this.numberBuild(param);
            case 'string':
                return this.stringBuild(param);
            case 'Buffer':
                return this.bufferBuild(param);
            case 'Date':
                return this.dateBuild(param);
            case 'Boolean':
                return this.booleanBuild(param);
            default:
                return this.stringBuild(param);
        }
    }

    /**
     * 构建数组类型参数序列化
     * @param param 
     */
    private arrayBuild(param: any): string {
        let paramDoc = new Array<string>();
        paramDoc.push('<array><data>');
        for (let i = 0, len = param.length; i < len; i++) {
            paramDoc.push('<value>');
            paramDoc.push(this.paramBuild(param[i]));
            paramDoc.push('</value>');
        }
        paramDoc.push('</data></array>');
        return paramDoc.join('');
    }

    /**
     * 构建对象类型参数序列化
     * @param param 
     */
    private objectBuild(param: any): string {
        let paramDoc = new Array<string>();
        paramDoc.push('<struct>');
        for (let key in param) {
            if (param.hasOwnProperty(key)) {
                let element = param[key];
                paramDoc.push('<member>');
                paramDoc.push(`<name>${key}</name>`);
                paramDoc.push('<value>');
                paramDoc.push(this.paramBuild(element));
                paramDoc.push('</value>');
                paramDoc.push('</member>');
            }
        }
        paramDoc.push('</struct>');
        return paramDoc.join('');
    }

    /**
     * 构建Number类型参数序列化
     * @param param 
     */
    private numberBuild(param: any): string {
        return `<i4>${param}</i4>`;
    }

    /**
     * 构建String类型参数序列化
     * @param param 
     */
    private stringBuild(param: any): string {
        return `<string>${this.escape(param)}</string>`;
    }

    private escape(s: any) {
        return String(s)
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/@/g, '&#64;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * 构建Buffer类型参数序列化
     * @param param 
     */
    private bufferBuild(param: any): string {
        return `<base64>${param.toString('base64')}</base64>`;
    }

    /**
     * 构建Date类型参数序列化
     * @param param 
     */
    private dateBuild(param: any): string {
        return `<dateTime.iso8601>${param.toISOString()}</dateTime.iso8601>`;
    }

    /**
    * 构建boolean类型参数序列化
    * @param param 
    */
    private booleanBuild(param: any): string {
        return `<boolean>${param ? '1' : '0'}</boolean>`;
    }
}