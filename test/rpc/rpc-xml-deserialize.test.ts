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

    test("DeletePostResult", async function () {
        let xml = '<?xml version="1.0"?><methodResponse><params><param><value><boolean>0</boolean></value></param></params></methodResponse>';

        let result = await rpcXmlDeserialize.deserializeBoolean(xml);

        assert.equal(false, result);
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

        let result = await rpcXmlDeserialize.deserializeCategoryInfoStruct(xml);

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

});