import * as assert from 'assert';

import { RpcXmlSerialize } from '../../src/rpc/rpc-xml-serialize';
import { DeletePostParam, GetUsersBlogsParam, EditPostParam, GetCategoriesParam, GetPostParam, GetRecentPostsParam, NewMediaObjectParam, NewPostParam, NewCategoryParam } from '../../src/rpc/rpc-package';

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

    test("GetPostParam", function () {
        let xml = '<methodCall><methodName>metaWeblog.getPost</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param></params></methodCall>';

        let data: GetPostParam = {
            postid: '123',
            username: 'username',
            password: 'password',
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getPost',
            params: data
        });

        assert.equal(xml, serialize);
    });

    test("GetRecentPostsParam", function () {
        let xml = '<methodCall><methodName>metaWeblog.getRecentPosts</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><i4>10</i4></value></param></params></methodCall>';

        let data: GetRecentPostsParam = {
            blogid: '123',
            username: 'username',
            password: 'password',
            numberOfPosts: 10
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.getRecentPosts',
            params: data
        });

        assert.equal(xml, serialize);
    });

    test("NewMediaObjectParam", function () {
        let base64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCABHAFkDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAEFAgMEBv/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/aAAwDAQACEAMQAAAB1Td9XseB5iPS8i1Gs9WuPDPTjauqc0xjMkWl35O84ezl2VTfmt1Si1rhXZHVqjcnlwssymuqS3lVkbc8oEglBEzjMNVrV2VOivGmACYEhCYGuxKb8IviABIAR//EACIQAAIBAwQDAQEAAAAAAAAAAAABAwIEERIUMDQQEyAFJP/aAAgBAQABBQIwY+cM0s0M0mlGxqF+ch2MNJVFbUjcKHWjUzL+abqtE82Lbcs3KPbEzEFR6ImbRDtKh20iHDWjRV4uH/D8ZNdQpq0K5rFdM3S8T9Ljm6nHL1eOXrccvX4v/8QAIhEAAQMCBgMAAAAAAAAAAAAAAAECAwQREhMgMTJBFCFS/9oACAEDAQE/AUppV6Fp3t3FsnZiLlynmfgf7M+Q8he0M1i7tLwqYYvoi4u1R8Xam8V1f//EACARAAEDAwUBAAAAAAAAAAAAAAEAAgMSIDIEEyNBUTH/2gAIAQIBAT8BOpjCGoafiDierJom1NWy1bPhVD+iuUKuTxS5Nukybc/IXf/EACQQAAEDAwMEAwAAAAAAAAAAAAABAyECMDEQMoESIEGxQ1Hw/9oACAEBAAY/ArWTJCk1kuKfJUQ0vKkN0pY6/swTSSh4IUiohTBtMLo1x67smdJQ26Ncerjf7xcbuN3G7f8A/8QAJhAAAgEBBwMFAAAAAAAAAAAAAAERECEwMUFRYZEgccGBodHw8f/aAAgBAQABPyFIdCKwbTFpnYI50ByWIyk2LWwwr7WHwdBi2oAGzRdkbhb0P7WQaYxgU1oTQyjxRHlz1G0MkM1QYkx+cTQySSaS1EjB+aFQxh9CQ/JdE0fnV4fl8XnvfF59vZXf/9oADAMBAAIAAwAAABCOqFRmXcNIXo42RzAWqD765O1yN/4L3//EACERAAIBAgYDAAAAAAAAAAAAAAABERAxICFBUXGBocHh/9oACAEDAQE/EHeQzh0uzYCRMkITWIStSWwz7g2jRJaHQ8cdIpBA0cGLwfaxf//EACARAAMAAQIHAAAAAAAAAAAAAAABETEgcRAhQVGBocH/2gAIAQIBAT8QyjMOb8HNEFWRkEJLLH2SFkRAb1EyZW7wicYLdzV7vwWn/8QAJRAAAgECBQQDAQAAAAAAAAAAAAERECExQVFhcSCBkbEwodHw/9oACAEBAAE/EGkORIYhEIUsJfYTMPENae4sxpyyDB7I3Pgck4txhoixCYazRd6J9r6D0hxG+P8A0ydZSpYw9ShszEsrt+TOqi5UngQclGNrcVRpdrw7mLgrdCdRoEe1hA7rYI765gRTltyUhODJHB6Ka0OgnS/KiQmjEkSHZlwx7YhpZnyZUN0SLL4ZvRMlVpQTWSSSROhEi+jST0zSZW31+FUQ38NNVVVVE4Gs6tvrF0f/2Q==';
        let xml = '<methodCall><methodName>metaWeblog.newMediaObject</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><struct><member><name>bits</name><value><base64>' + base64 + '</base64></value></member><member><name>name</name><value><string>aa.jpg</string></value></member><member><name>type</name><value><string>image/jpg</string></value></member></struct></value></param></params></methodCall>';

        let data: NewMediaObjectParam = {
            blogid: '123',
            username: 'username',
            password: 'password',
            file: {
                bits: Buffer.from(base64, 'base64'),
                name: "aa.jpg",
                type: "image/jpg"
            }
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.newMediaObject',
            params: data
        });
        assert.equal(xml, serialize);
    });

    test("NewPostParam", function () {
        let xml = '<methodCall><methodName>metaWeblog.newPost</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><struct><member><name>description</name><value><string>博客测试内容</string></value></member><member><name>title</name><value><string>标题测试内容</string></value></member><member><name>categories</name><value><array><data><value><string>[Markdown]</string></value></data></array></value></member></struct></value></param><param><value><boolean>0</boolean></value></param></params></methodCall>';

        let data: NewPostParam = {
            blogid: '123',
            username: 'username',
            password: 'password',
            post: {
                description: "博客测试内容",
                title: "标题测试内容",
                categories: ["[Markdown]"]
            },
            publish: false
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'metaWeblog.newPost',
            params: data
        });
        assert.equal(xml, serialize);
    });

    test("NewCategoryParam", function () {
        let xml = '<methodCall><methodName>wp.newCategory</methodName><params><param><value><string>123</string></value></param><param><value><string>username</string></value></param><param><value><string>password</string></value></param><param><value><struct><member><name>name</name><value><string>crud</string></value></member><member><name>parent_id</name><value><i4>0</i4></value></member></struct></value></param></params></methodCall>';

        let data: NewCategoryParam = {
            blog_id: '123',
            username: 'username',
            password: 'password',
            category: {
                name: "crud",
                parent_id: 0
            }
        };

        let serialize = rpcXmlSerialize.serialize({
            methodName: 'wp.newCategory',
            params: data
        });

        assert.equal(xml, serialize);
    });
});