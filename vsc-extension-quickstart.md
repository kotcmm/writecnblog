# 下载运行说明

## 下载源码

    git clone https://github.com/kotcmm/writecnblog.git

进入项目目录，运行 `npm i` 进行依赖包安装
`clipboard-data`需要单独安装来适配vscode运行

    npm i clipboard-data --runtime=electron --target=69 

`--target`为`abi`版本号，也就是`NODE_MODULE_VERSION`。

安装完成后，用vscode打开项目，按`F5`进行插件运行和调试，选择`Extension Tests`可以运行测试用例