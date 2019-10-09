import * as assert from 'assert';
import { RpcXmlSerialize } from '../../src/rpc/rpc-xml-serialize';
import { DeletePostParam, GetUsersBlogsParam, EditPostParam, GetCategoriesParam } from '../../src/rpc/rpc-package';

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

    test("EditPostParam", function () {
        let xml = '<methodCall><methodName>metaWeblog.editPost</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><struct><member><name>dateCreated</name><value><dateTime.iso8601>2019-10-09T12:55:00.000Z</dateTime.iso8601></value></member><member><name>description</name><value><string>111</string></value></member><member><name>title</name><value><string>222</string></value></member></struct></value></param><param><value><boolean>0</boolean></value></param></params></methodCall>';

        let data: EditPostParam = {
            postid: '123',
            username: 'username',
            password: 'password',
            post: {
                dateCreated: new Date('2019-10-09T12:55:00.000Z'),
                description: "111",
                title: "222"
            },
            publish: false
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.editPost',
            params: data
        });

        assert.equal(xml, serialize);
    });

    test("GetCategoriesParam", function () {
        let xml = '<methodCall><methodName>metaWeblog.getCategories</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param></params></methodCall>';

        let data: GetCategoriesParam = {
            blogid: '123',
            username: 'username',
            password: 'password',
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getCategories',
            params: data
        });

        assert.equal(xml, serialize);
    });
});