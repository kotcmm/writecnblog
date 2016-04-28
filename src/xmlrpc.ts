"use strict";

var request = require('request');
var parseString = require('xml2js').parseString;

export class Xmlrpc {
    private options;
    constructor(rpc_url: string) {
        this.options = {
            url: rpc_url,
            headers: '{Content-Type:application/xml}',
            method: 'post',
            body: ''
        };
    }

    send(...params: any[]) {
        
        var that = this;
        
        var len = params.length - 1;
        var callback = params[len]
        
        var paramsData = [];
        for(var i = 0; i < len; i++) {
            paramsData.push(params[i]);
        }
    
        this.options.body = this.xmlSerialize(paramsData);
        
        request(this.options, function (error, response, body) {
            parseString(body, function (err, result) {
                var backData = that._parse(result)
                if(callback){
                    var method = params[0];
                    callback(err, method, backData);
                }
            });
        });
    }

    private xmlSerialize(params: any[]): string {
        var method = params[0];
        var doc = [];
        doc.push('<methodCall>');
        doc.push('<methodName>' + method + '</methodName>');
        if (params.length > 1) {
            doc.push('<params>');
            for (var i = 1, len = params.length; i < len; i++) {
                doc.push('<param><value>');
                this.paramsSerialize(params[i], doc);
                doc.push('</value></param>');
            }
            doc.push('</params>');
        }
        doc.push('</methodCall>');
        return doc.join('\n');
    }

    private paramsSerialize(data, d) {
        switch (data.constructor.name) {
            case 'Array':
                d.push('<array><data>');
                for (var i = 0, len = data.length; i < len; i++) {
                    d.push('<value>');
                    this.paramsSerialize(data[i], d);
                    d.push('</value>');
                }
                d.push('</data></array>');
                break;
            case 'Object':
                d.push('<struct>');
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var element = data[key];
                        d.push('<member>');
                        d.push('<name>' + key + '</name>');
                        d.push('<value>');
                        this.paramsSerialize(element, d);
                        d.push('</value>');
                        d.push('</member>');
                    }
                }
                d.push('</struct>');
                break;
            case 'Number':
                d.push('<int>' + data + '</int>');
                break;
            case 'String':
                d.push('<string>' + this.escape(data) + '</string>');
                break;
            case 'Date':
                d.push('<dateTime.iso8601>' + data.toISOString() + '</dateTime.iso8601>');
                break;
            case 'Boolean':
                d.push('<boolean>' + (data ? '1' : '0') + '</boolean>');
                break;
            default:
                d.push('<string>' + this.escape(data) + '</string>');
                break;
        }
    }

    private escape(s) {
        return String(s)
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/@/g, '&#64;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    private _parse(result) {
        if (Array.isArray(result)) {
            return this._parse(result[0]);
        } else {
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    if (key == "methodResponse") {
                        var methodResponse = result[key];
                        return this._parse(methodResponse);
                    }

                    if (key == "params") {
                        var params = result[key];
                        return this._parse(params);
                    }

                    if (key == "param") {
                        var param = result[key];
                        return this._parse(param);
                    }

                    if (key == "fault") {
                        var fault = result[key];
                        return this._parse(fault);
                    }

                    if (key == "value") {
                        var dataArray = new Array();
                        return this.valueParse(result[key]);
                    }
                }
            }
        }

    }


    private valueParse(result) {
        if (Array.isArray(result)) {
            return this.valueParse(result[0]);
        } else {
            for (var name in result) {
                if (name === 'struct') {
                    return this.valueParse(result.struct);
                } else if (name === 'array') {
                    return this.valueParse(result.array);
                } else if (name === 'boolean') {
                    return result[name] === '1';
                } else if (name === 'data') {
                    return this.valueParse(result.data);
                } else if (name === 'value') {
                    var dataArray = [];
                    var values = result.value;
                    for (var i = 0, l = values.length; i < l; i++) {
                        var value = values[i];
                        dataArray[i] = this.valueParse(value);
                    }
                    return dataArray;
                } else if (name === 'member') {
                    var data = {};
                    var members = result.member;
                    for (var i = 0, l = members.length; i < l; i++) {
                        var member = members[i];
                        data[member.name[0]] = this.valueParse(member.value[0]);
                    }
                    return data;
                } else {
                    return result[name][0];
                }
            }
        }
    }
}