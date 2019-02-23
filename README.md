# writeCnblog README

"writeCnblog" 是一个基于rpcxml协议给[博客园](http://www.cnblogs.com/)发布Markdown格式的插件

## Features

将图片上传到博客园，并返回图片的地址。

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)


## Requirements

需要vs code版本在1.1.21以上。

## Extension Settings

This extension contributes the following settings:

* `writeCnblog.blogName`: 博客园的Blog地址名
* `writeCnblog.userName`: 博客园的用户名
* `writeCnblog.passWord`: 博客园的密码

## Known Issues

## Release Notes

### 0.0.9

没有文件夹时自动创建

### 0.0.8

将剪切板的图片直接保存本地并上传到博客园。

### 0.0.6

插入的图片加上本地文件名，如`![本地文件名](图片url)`

### 0.0.5

修复配置可以被读取到。

### 0.0.4

用户名密码从配置中读取，图片可以直接选择。

#### v0.0.2更新

1.保存用户名密码到钥匙串里面

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

* 通过 (`Shift+i` on macOS or `Shift+i` on Windows and Linux)选择一个需要上传的图片，上传成功会返回一个`![图片名](图片url)`

* 通过 (`Shift+Alt+i` on macOS or `Shift+Alt+i` on Windows and Linux)从剪切板读取图片保存到当前markdown目录的Images/markdown文件名/中并上传的图片，上传成功会返回一个`![图片名](图片url)`

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
