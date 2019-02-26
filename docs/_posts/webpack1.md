---
tags:
  - webpack
date: 2019-01-29
title: webpack(1)基本配置
vssue-title: webpack(1)基本配置
---

讲的是webpack基础配置和名词概念

<!-- more -->

1. 基本配置
    1. [entry](#_1-entry)
    2. [output](#_2-output)
    3. [loader](#_3-loader)
    4. [plugin](#_4-plugin)

### 1. entry

项目的入口文件，它的类型可以是String, array, 或 object;


### 2. output

项目的输出文件，它的类型的Object，里面包含很多配置项。
<b>filename</b>  输出文件的名称
<b>path</b>  输出文件的放置位置

需要配置一个多入口的项目，就至少需要配置entry和output两个参数才可以
```
module.exports = {
  entry: {
    'main': './js/main.js',
    'main2': './js/main2.js'
  },
  output: {
    filename: '[name].js', // [name] 的值是entry的键值, 会输出多个入口文件
    // 将输出的文件都放在dist目录下
    path: path.resolve(__dirname, './dist')
  }
};
```
由于浏览器的缓存机制，所以在生成的文件后面需要加下hash值，可以避免打包生成的文件名重复
```
  filename: '[name]_[hash:8].js',
```
_上面配置是将所有的文件在重新打包后都加上hash，那么如果某些文件（第三方库）的代码不更改，开发想不更改第三方库打包后的文件，这样就可以避免用户使用流量下载重复代码，这个问题会后续给出方法的_

### 3. loader

webpack是对项目中的资源进行打包的，里面的所有资源都是模块。webpack内部就是有对模块资源进行加载机制。那么是怎么处理的？
这就要说loader的用处。loader可以理解为是模块和资源的转换器，转化成string。
那么问题来了
*  假设只是一个图片路径（string）如何变成模块或者资源，然后经由loader处理变成string?
    >  webpack的打包是不会对string处理的，所以需要对一个实际意义是资源请求的string进行处理。[vueloader中是这么介绍的](https://vue-loader.vuejs.org/zh/guide/asset-url.html)
    > ```
    >  src: require('../image.png') // 现在这是一个模块的请求了
    >```

不知道通过这个问题，让人更加明白webpack的loader转换机制。

----
配置loader，需要使用rules模块来读取和解析规则，它是一个数组，数组里面中的每一项描述了如何处理部分文件。
1. 条件匹配： 通过配置test，include，exclude三个配置项来选中loader需要应用规则的文件。
2. 应用规则： 对选中的文件通过use配置项来应用loader，可以只应用一个loader或者按照从右往左（或者从上往上）的顺序应用一组loader，也可以向loader传入参数
3. 重置顺序： Loader执行的顺序默认是从右到左执行的，但是我们可以通过enforce选项可以将其中一个Loader的执行顺序放到最前或最后，pre是强制先执行，post是强制后执行。
```
rule: [
  {
    // 正则匹配 以 less结尾的
    test: /\.less$/,
    // 先匹配符合资源先less-loader处理，在css-loader处理
    use: [
      'css-loader',
      {
        loader: 'less-loader',
        enforce: 'pre' // 强制先执行
      }
    ],
    // include只包含src目录下的js文件，加快查找速度
    include: path.resolve(__dirname, 'src')
  }
]
```


### 4. plugin

webpack的插件机制就是将插件函数挂载到webpack的核心（compiler对象）中，然后通过compiler的事件钩子来处理资源。这一听就感觉和loader相差甚远，因此plugin也没有执行顺序指之说。
基本用法

```
// 提取css的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //require自己想要用的插件
plugins: [
  new ExtractTextPlugin({
    // 从js文件中提取出来的 .css文件的名称
    filename: `main.css`
  })
]
```

2.webpack的一些名词概念

*  模块热更新
    >  他可以使得代码修改过后不用刷新浏览器可以更新，通过socket推送代码更改的消息

*  bundle  chunk  moudule
    >  bundle是由webpack打包出来的文件(文件束)，chunk是指webpack在进行模块的依赖分析的时候，代码分割出来的代码块，module是开发中的单个模块，
Chunk最终打包成bundle

*  长缓存
    >  代码升级或是更新，打包后的文件hash是不同的，所以尽量减少更新打包的文件，让用户尽量少下载新打包的文件

*  path.resolve 
    >  path是webpack的一个内置模块，path.resolve是path的一个方法，用于将相对路径转为绝对路径，参数可以传多个，输出路径。__dirname是一般用于这个函数的第一个参数，这个参数的意思就是当前文件所在文件夹的目录路径。