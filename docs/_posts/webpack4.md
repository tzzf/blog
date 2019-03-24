---
tags:
  - webpack
date: 2019-03-15
title: webpack(4)node_modules js打包优化
vssue-title: webpack(4)node_modules js打包优化
---

node_modules js打包优化

<!-- more -->

如何减少打包项目的文件呢？
<br />
一个项目分css，js，html组成。我们这主要讲讲js，js分node_modules的js和app的js。
<br />
webpack在打包过程中，在不做任何配置时，肯定是会对node_modules的js和app的js都做打包操作的。那么编译过程中肯定是需要花很大的时间。但是开发者在开发过程中，很少会对node_modules的js操作，那么就有优化的思绪了。如何优化呢？
<br />
1. 减少node_modules的js的大小，将他们用cdn的链接，那么cdn引入的js,如何模块化被引入到项目中
2. node_modules的js不会被改变，那么将node_modules的js做缓存，在打包的时候比较下若没改变就不打包了，用之前的js，而且这样打包的好处就是代码在被更新到生产环境，用户更新的文件的大小会被大大缩小，因为node_modules的js打包的文件并没有改，用户就不用浪费流量去更新，这样体验感会更好些。
<br />
cdn如何将模块化被引入到项目中去呢？
<br />
一种是项目中引入这个模块但是不打包这个模块（externals），另一种是用webpack的插件providePlugin给项目提供一个模块
### 1. externals
  下面就来讲讲webpack的[externals](https://webpack.docschina.org/configuration/externals/)。
  <br />
  > 具有外部依赖(external dependency)的 bundle 可以在各种模块上下文(module context)中使用，例如 CommonJS, AMD, 全局变量和 ES2015 模块。外部 library 可能是以下任何一种形式
  > * root：可以通过一个全局变量访问 library（例如，通过 script 标签）。
  > * commonjs：可以将 library 作为一个 CommonJS 模块访问。
  > * commonjs2：和上面的类似，但导出的是 module.exports.default。
  > * amd：类似于 commonjs，但使用 AMD 模块系统
  <br />
  那么externals如何使用呢？
  <br />
  externals的配置有以下几种：array , object ,reg。
  <br />
  ###### string
    这样就是写自己import的模块，但是只能引入一个模块，所以基本没什么用
  ###### Object
    object的话，开发这就配置多个模块,下面做个jqury的例子
    ```
      externals: {
        'jquery': '$' // 前面的'jquery'的意思就是凡是业务代码中引入的jquery的模块都不被打包。
      },
    ```
### 2. providePlugin
  ProvidePlugin 的机制是：当 webpack 加载到某个 js 模块里，出现了未定义且名称符合（字符串完全匹配）配置中 key 的变量时，会自动 require 配置中 value 所指定的 js 模块。
  <br />
  举个jquery例子
  ```
    new webpack.ProvidePlugin({
      $: 'jquery',
    });
    // 这样在业务代码在不需要import或者require，就可以直接使用$，但是其实可以使用是$是来源于cdn。
  ```
上面讲完了如何减少node_modules的体积。下面就开始讲讲如何将不变的node_modules如何每次打包输出的js是一样。
### 3.splitChunks
  webpack4.0之后引入的新的splitChunks配置，去除之前的CommonsChunkPlugin，并且在splitChunks中加了cacheGroups概念，使得在打包中会对比打包的chunkgroup中是否有更改，有再去打包。
  <br />
  下面上一个官方配置认为这种默认配置是保持web性能的最佳实践。
  ```
    module.exports = {
      optimization: {
        minimize: env === 'production' ? true : false, //是否进行代码压缩
        splitChunks: {
          chunks: "async", // 有三个配置项，initial、async、 all。默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码。
          minSize: 30000, //模块大于30k会被抽离到公共模块
          minChunks: 1, //模块出现1次就会被抽离到公共模块
          maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
          maxInitialRequests: 3, //入口模块最多只能加载3个
          name: true, // chunk 的名称，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个，这就是为什么 umi 默认只有一个 vendors.async.js。
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20  // 一个模块可能属于多个 chunkGroup，这里是优先级，自定义的 group 是 0
              reuseExistingChunk: true,  // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            }
          }
        },
        runtimeChunk {
          name: "runtime"
        }
      }
    }
  ```
  下面就上一下我所使用的配置
  ```
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
              vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name(module) {
                      // get the name. E.g. node_modules/packageName/not/this/part.js
                      // or node_modules/packageName
                      const packageName = module.context.match(
                          /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                      )[1];

                      // npm package names are URL-safe, but some servers don't like @ symbols
                      return `npm.${packageName.replace("@", "")}`;
                  }
              },
              components: {
                name: "chunk-components",
                test: path.resolve("src/components"), // 单独打包自己写的组件
                minChunks: 1, // 最小共用次数
                priority: 5,
                reuseExistingChunk: true 
              }
          }
      }
    },
  ```
  那么开始讲讲我的和官方提供的区别。我在官方的基础上将node_modules引入的不同模块分别拆开打包成一个js，这样做的好处是在http2.0的多路复用下可以请求多个请求，那么拆分后体积变小速度就能更快了。然后我又将components文件夹单独打包，这样主业务逻辑的js体积变得更小一些。

  ----
  ###### 参考
  * [https://segmentfault.com/a/1190000018368885](https://webpack.docschina.org/configuration/externals/)

