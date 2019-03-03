---
tags:
  - webpack
date: 2019-03-03
title: webpack(3)webpack3.X升级到webpack4.X经历
vssue-title: webpack(3)webpack3.X升级到webpack4.X经历
---

公司之前的vue项目用的webpack3.x，觉得自己对webpack也有了一定经验，于是开始了试试之旅

<!-- more -->

webpack升级到4.x的更新，是有很多大改动的，也有一些平滑的升级，那么下面我开始介绍了

1. webpack升级到4.x后，把核心代码和客户端分离开了，所以同时也必须要依赖webpack-cli这个包
```
yarn add webpack-cli -dev
```
2.  webpack升级后，导致plugin机制也跟着一起变化了，因此插件包也需要升级
```
yarn add html-webpack-plugin —dev
```
webpack 3.X用于打包css的插件extract-text-webpack-plugin，不能在4中使用，所以经过有两个方法可以解决

```
// 方法一 extract-text-webpack-plugin 包有个为了webpack4.x单独开发了个next版本
yarn add html-webpack-plugin@next —dev
// 方法二 用新的打包css包 mini-css-extract-plugin
yarn add mini-css-extract-plugin —dev
// mini-css-extract-plugin使用方法
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module: {
  rules: [
    {
      test: /\.less$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    },
  ]
}
// loder的运行机制是从右到左的，所以需要在css-loader之后再加上打包css操作。
```
3. webpack4.x的mode是必填项
mode分development（开发环境） 和 production（生产环境），webpack对不同的环境也不同的默认操作。
<br />

|    选项    |       描述       |
|:-------:|:------------- |
|   development  |     启用 NamedChunksPlugin 和 NamedModulesPlugin   | 
|  production  | 启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin（tree-shaking） 和 UglifyJsPlugin（压缩代码） |

4. webpack4.x也废弃了一些之前的插件

  * 废弃插件：UglifyjsWebpackPlugin
    <br>
     mode 为production时，默认开启。
  * ModuleConcatenationPlugin
    新增属性：concatenateModules
    ```
    // 配置
    module.exports = {
      //...
      optimization: {
        concatenateModules: true
      }
    };
    //开启前
    [
        /* 0 */
        function(module, exports, require) {
            var module_a = require(1)
            console.log(module_a['default'])
        }
        
        /* 1 */
        function(module, exports, require) {
            exports['default'] = 'module A'
        }
    ]
    //开启后
    [
        function(module, exports, require) {
            var module_a_defaultExport = 'module A'
            console.log(module_a_defaultExport)
        }
    ]
    ```
    concatenateModules开启之后，可以看出bundle文件中的函数声明变少了，因而可以带来的好处，其一，文件的体积比之前更小了，其二，运行代码时创建的函数作用域变少了，开销也随之变少了。
  * 废弃插件：CommonsChunkPlugin
    <br>
    新增属性：splitChunks
    <br>

    ```
    optimization: {
      splitChunks: {
        chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
        minSize: 0,                // 最小尺寸，默认0
        minChunks: 1,              // 最小 chunk ，默认1
        maxAsyncRequests: 1,       // 最大异步请求数， 默认1
        maxInitialRequests: 1,    // 最大初始化请求书，默认1
        name: () => {},              // 名称，此选项课接收 function
        cacheGroups: {                 // 这里开始设置缓存的 chunks
          priority: "0",                // 缓存组优先级 false | object |
          vendor: {                   // key 为entry中定义的 入口名称
            chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
            name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
            minSize: 0,
            minChunks: 1,
            enforce: true,
            maxAsyncRequests: 1,       // 最大异步请求数， 默认1
            maxInitialRequests: 1,    // 最大初始化请求书，默认1
            reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
          }
        }
      }
    },
    ```

    chunks在设置的尽量不要设置成async（异步），我在打包时测试，如果选异步会导致生成文件偏大，我猜测是因为在打包多个vendor时异步就很难通知别的vendor某个包已被打包了，导致重复打包。
5. 说了那么多变化大，那么webpack平滑升级操作有吗？答案是当然有的。
  <br>
  比如 module.loaders 替换为 modules.rules
  在webpack3.x的时候module就可以使用module.rules

  ```
  module: {
    rules: [
      ...
    ]
  }
  ```

6. 以上对针对webpack配置的升级，那么自己的项目在本次升级有什么问题呢？
  * `Module parse failed: Unexpected character '#' (16:0)  You may need an appropriate loader to handle this file type.`
  ```
  const VueLoaderPlugin = require('vue-loader/lib/plugin’)
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
  ```
  * `Module build failed (from ./node_modules/postcss-loader/src/index.js):
Error: Cannot load preset "advanced". Please check your configuration for errors and try again`
  ```
  yarn add cssnano-preset-advanced -dev
  ```
  * `XXX already has a 'content' property, give up to overwrite it.`
  在自己项目css中有使用after的content，会被打包库打包
  ```
  "postcss-viewport-units": {
    filterRule: rule => rule.nodes.findIndex(i => i.prop === 'content') === -1
  },
  ```
  * `TypeError: Cannot read property 'eslint' of undefined`
  eslint-loader 2.0以上
  ```
  yarn add eslint-loader -dev
  ```
7. 对项目文件存放的理解，vue脚手架工具会有生成static文件夹和assets文件夹
之前项目在开发中也有草莽之处，就是放静态文件全都放到static文件夹中。从现在自己的知识角度来看，才发现这是个很大的错误。
<br>
首先讲下是什么导致static文件夹和asset文件夹有所不同的
```
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, '../static'),
    to: config.build.assetsSubDirectory,
    ignore: ['.*']
  }
])
```
正是因为这段webpack的配置导致这两个文件夹有所不同。那么这两个文件夹的作用是什么呢
<br>
先说个人结论吧，static文件夹适合放那些不能被webpack进行模块和资源的转换的文件，而assets文件夹更适合能被webpack进行模块和资源的转换的文件。
<br>
那么什么样的文件能做进行模块和资源的转换？
<br>
比如说： img的src是相对路径（'../image.png'）, 或者是background: url(../image.png),亦或者是img: require('../image.png')，代码在被webpack解析的时候，将被视为webpack的模块依赖。被视为模块依赖，就会走webpack的loader操作，那么这些静态不需要被拷贝到dist文件夹下，他有可能被loader转化成base64，也有可能经过处理被输出到dist文件下，所以并不需要被拷贝到dist文件夹下。

<br>
----
综上是我总结--
