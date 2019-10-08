import * as assert from 'assert';
import { RpcXmlSerialize } from '../../src/rpc/rpc-xml-serialize';
import { DeletePostParam, GetUsersBlogsParam } from '../../src/rpc/rpc-package';

suite("RpcXmlSerialize Tests", function () {

    let rpcXmlSerialize = new RpcXmlSerialize();

    test("DeletePostParam", function () {
        let xml = '<methodCall><methodName>blogger.deletePost</methodName><params><param><value><string>appkey</string></value></param><param><value><string>postid</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><boolean>0</boolean></value></param></params></methodCall>';

        let data: DeletePostParam = {
            appKey: 'appkey',
            postid: 'postid',
            username: 'username',
            password: 'password',
            publish: false
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'blogger.deletePost',
            params: data
        });

        assert.equal(xml, serialize);
    });

    test("GetUsersBlogsParam", function () {
        let xml = '<methodCall><methodName>blogger.getUsersBlogs</methodName><params><param><value><string>appkey</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param></params></methodCall>';

        let data: GetUsersBlogsParam = {
            appKey: 'appkey',
            username: 'username',
            password: 'password',
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'blogger.getUsersBlogs',
            params: data
        });

        assert.equal(xml, serialize);
    });
});