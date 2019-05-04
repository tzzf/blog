---
tags:
  - base
date: 2019-05-04
title: 搭建一个babel环境
vssue-title: 搭建一个babel环境
---
搭建一个babel环境
<!-- more -->

最近在开始在研究aop，由于就是需要搭建一个babel环境来编译自己写的aop代码。
```
Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，
以便能够运行在当前和旧版本的浏览器或其他环境中。
```
安装babel-cli
```
npm install babel-cli -g
```
新建一个文件夹
```
mkdir babel-js && cd babel-js
```
开始搭建
```
npm init

npm install babel-core babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-2 babel-plugin-transform-decorators-legacy --save-dev
```
然后稍微修改下npm的脚本
```
"build": "babel src -w -d lib" // 监听src文件夹下文件的变化然后输出到lib文件夹下
```
配置下babel
```
touch .babelrc


{
  "presets": ["es2015", "stage-2"],  //设置转码规则
  "plugins": ["transform-runtime", "transform-decorators-legacy"]  //设置插件
}
```

以上呢，就是babel的环境搭建，但是在写的过程，发现希望可以自动化输出自己的写的demo的结果。
<br />

那么下面开始介绍nodemon，nodemon是用来监视nodejs应用程序中的任何更改并自动重启服务，非常适用于开发环境。
<br />
所以比如我们之前输出的写的demojs，是用node /lib/demo.js。那么现在可以用nodemon来运行这个命令行
<br />
安装
```
npm install -g nodemon
```
然后在文件根目录下新建一个nodemon.json，来写nodemon的配置。
<br />
restartable-设置重启模式 
<br />
ignore-设置忽略文件 
<br />
verbose-设置日志输出模式，true 详细模式 
<br />
execMap-设置运行服务的后缀名与对应的命令 
<br />
```
{ 
    "js": "node –harmony"
} 
```
表示使用 nodemon 代替 node 
<br />
watch-监听哪些文件的变化，当变化的时候自动重启 
<br />
ext-监控指定的后缀文件名
<br />
exec - 输入nodemon运行的脚本（这个是大部分中文教学文档都没写的）
<br />
然后输入nodemon。运行写在exec里的脚本
<br />
```
{
  "watch": [
    "lib"
  ],
  "exec": "node lib/symbol.js"
}
```
由于这里功能不需要太多，我也没写太多配置


