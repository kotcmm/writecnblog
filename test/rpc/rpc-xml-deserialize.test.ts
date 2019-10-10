import * as assert from 'assert';
import { RpcXmlDeserialize } from '../../src/rpc/rpc-xml-deserialize';


suite("RpcXmlDeserialize Tests", function () {

    let rpcXmlDeserialize = new RpcXmlDeserialize();

    test("FaultResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><fault><value><struct><member><name>faultCode</name><value><i4>500</i4></value></member><member><name>faultString</name><value><string>wrong username/password</string></value></member></struct></value></fault></methodResponse>';
        let message = '';
        try {
            await rpcXmlDeserialize.deserializeBlogInfoStruct(xml);
        } catch (error) {
            message = error.message;
        }
        assert.equal(message, 'wrong username/password');
    });

    test("BooleanResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeBoolean(xml);

        assert.equal(false, result);
    });

    test("StringResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><string>123456</string></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeString(xml);

        assert.equal("123456", result);
    });

    test("NumberResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><i4>123456</i4></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeNumber(xml);

        assert.equal(123456, result);
    });

    test("BlogInfoStructResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><array><data><value><struct><member><name>blogid</name><value><string>dsafds</string></value></member><member><name>url</name><value><string>http://www.cnblogs.com/caipeiyu/</string></value></member><member><name>blogName</name><value><string>蛀牙</string></value></member></struct></value></data></array></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeBlogInfoStruct(xml);

        let blogInfo = {
            blogid: "dsafds",
            url: "http://www.cnblogs.com/caipeiyu/",
            blogName: "蛀牙"
        };

        assert.deepEqual(blogInfo, result);
    });

    test("CategoryInfoResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><array><data><value><struct><member><name>description</name><value><string>[发布至博客园首页]</string></value></member><member><name>htmlUrl</name><value><string /></value></member><member><name>rssUrl</name><value><string /></value></member><member><name>title</name><value><string>[发布至博客园首页]</string></value></member><member><name>categoryid</name><value><string>0</string></value></member></struct></value><value><struct><member><name>description</name><value><string>[Markdown]</string></value></member><member><name>htmlUrl</name><value><string /></value></member><member><name>rssUrl</name><value><string /></value></member><member><name>title</name><value><string>[Markdown]</string></value></member><member><name>categoryid</name><value><string>-5</string></value></member></struct></value></data></array></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeCategoryInfoStructArray(xml);

        let categoryInfos = [{
            description: "[发布至博客园首页]",
            htmlUrl: "",
            rssUrl: "",
            title: "[发布至博客园首页]",
            categoryid: "0",
        }, {
            description: "[Markdown]",
            htmlUrl: "",
            rssUrl: "",
            title: "[Markdown]",
            categoryid: "-5",
        }];

        assert.deepEqual(categoryInfos, result);
    });

    test("PostStructResult", async function () {
        let xml = '<methodResponse><params><param><value><struct><member><name>dateCreated</name><value><dateTime.iso8601>20191009T12:55:00</dateTime.iso8601></value></member><member><name>description</name><value><string>博客内容</string></value></member><member><name>title</name><value><string>标题内容</string></value></member><member><name>categories</name><value><array><data><value><string>[Markdown]</string></value></data></array></value></member><member><name>enclosure</name><value><struct><member><name>length</name><value><i4>0</i4></value></member></struct></value></member><member><name>link</name><value><string>http://.html</string></value></member><member><name>permalink</name><value><string>http://.html</string></value></member><member><name>postid</name><value><i4>00000</i4></value></member><member><name>source</name><value><struct /></value></member><member><name>mt_keywords</name><value><string /></value></member></struct></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializePostStruct(xml);

        let post = {
            dateCreated: new Date('2019-10-09T12:55:00'),
            description: "博客内容",
            title: "标题内容",
            categories: ["[Markdown]"],
            enclosure: {
                length: 0
            },
            link: "http://.html",
            permalink: "http://.html",
            postid: 0,
            source: {},
            mt_keywords: ""
        };

        assert.deepEqual(post, result);
    });

    test("PostStructArrayResult", async function () {
        let xml = '<methodResponse><params><param><value><array><data><value><struct><member><name>dateCreated</name><value><dateTime.iso8601>20160405T18:32:00</dateTime.iso8601></value></member><member><name>description</name><value><string>博客测试内容</string></value></member><member><name>title</name><value><string>标题测试内容</string></value></member><member><name>enclosure</name><value><struct><member><name>length</name><value><i4>0</i4></value></member></struct></value></member><member><name>link</name><value><string>http://www.cnblogs.com/caipeiyu/p/5356274.html</string></value></member><member><name>permalink</name><value><string>http://www.cnblogs.com/caipeiyu/p/5356274.html</string></value></member><member><name>postid</name><value><string>5356274</string></value></member><member><name>source</name><value><struct /></value></member><member><name>userid</name><value><string>-2</string></value></member></struct></value></data></array></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializePostStructArray(xml);

        let post = [{
            dateCreated: new Date('2016-04-05T18:32:00'),
            description: "博客测试内容",
            title: "标题测试内容",
            enclosure: {
                length: 0
            },
            link: "http://www.cnblogs.com/caipeiyu/p/5356274.html",
            permalink: "http://www.cnblogs.com/caipeiyu/p/5356274.html",
            postid: "5356274",
            source: {},
            userid: "-2"
        }];

        assert.deepEqual(post, result);
    });

    test("UrlDataStructResult", async function () {
        let xml = '<methodResponse><params><param><value><struct><member><name>url</name><value><string>https://img2018.cnblogs.com/blog/248834/201910/248834-20191010131528379-1617332166.jpg</string></value></member></struct></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeUrlDataStruct(xml);

        let urlData = {
            url: "https://img2018.cnblogs.com/blog/248834/201910/248834-20191010131528379-1617332166.jpg",
        };

        assert.deepEqual(urlData, result);
    });

});