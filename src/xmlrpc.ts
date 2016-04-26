"use strict";

var request = require('request');

export class Xmlrpc{
    private options;
    constructor(rpc_url : string){
       this.options = {
                url: rpc_url,
                headers: '{Content-Type:application/xml}',
                method: 'post',
                body: ''
            };
    }
    
    send(...params:any[]){
            
        this.options.body = this.xmlSerialize(params);
        //console.log(this.options);
        
        request(this.options, function(error, response, body) {
            console.log(body);
        });
    }
    
    
    private xmlSerialize(params:any[]) : string{
        var method = params[0];
        var doc = [];
        doc.push('<methodCall>');
        doc.push('<methodName>' + method + '</methodName>');
        if(params.length > 1) {
            doc.push('<params>');
            for(var i = 1, len = params.length; i < len; i++) {
                doc.push('<param><value>');
                this.paramsSerialize(params[i], doc);
                doc.push('</value></param>');
            }
            doc.push('</params>');
        }
        doc.push('</methodCall>');
        return doc.join('\n');
    }
    
    private paramsSerialize(data,d){
        switch (data.constructor.name) {
	    case 'Array':
	        d.push('<array><data>');
	        for(var i = 0, len = data.length; i < len; i++) {
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
    
    private xmlParse(){
        
    }
}