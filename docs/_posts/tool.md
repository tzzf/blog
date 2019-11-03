---
tags:
  - tool
date: 2019-11-03
title: 利用cli写小工具
vssue-title: 利用cli写小工具
---

利用cli写小工具

<!-- more -->

webpack有loader可以自动化压缩图片，但是在之前没这么方便之前，那么是如何进行图片压缩的呢？
<br>
我将讲讲我的经历。从最一开始的时候，将图片一张一张放在压缩图片的网站上一张一张的压缩一张一张的下载，再一张一张的替换。这么方法实在是太蠢了。之后学会了gulp，利用gulp的插件压缩。这么虽然很便捷，但是有个问题，就是需要把图片复制到gulp项目的文件夹才能压缩。当时就特别想把gulp的压缩的方法放到全局（类似于软连接）直接压缩，不用这么麻烦复制来复制去。后来找到一个方法...
<br>
用js写一个CLI，那么开始
<br>
```
mkdir tool && cd tool
npm init --yes
```
下面就介绍下package.json的部分属性
<br>
### bin
很多模块有一个或多个需要配置到PATH路径下的可执行模块，npm让这个工作变得十分简单（实际上npm本身也是通过bin属性安装为一个可执行命令的）
<br>
先写可执行模块，在可执行模块中定义执行的脚本路径。
<br>
在package.json中定义bin的路径
```
"bin": {
    "tool": "./bin/tool"
},
```

在根目录创建/bin/tool文件

```
#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../src').cli(process.argv)
```

这里需要yarn add esm模块。
<br>
这里也定义的脚本路径在src文件下的index.js。然后在index.js的脚本定义一条gulp压缩图片的代码。但是怎么解析命令行输入呢。
下面就需要用另一个包了（commander）
<br>
简单介绍下，commander灵感来自 Ruby，它提供了用户命令行输入和参数解析的强大功能，可以帮助我们简化命令行开发。
<br>
* command – 定义命令行指令，后面可跟上一个name，用空格隔开，如 .command( ‘app [name] ‘)
* alias – 定义一个更短的命令行指令 ，如执行命令$ app m 与之是等价的
* description – 描述，它会在help里面展示
* option – 定义参数。它接受四个参数，在第一个参数中，它可输入短名字 -a和长名字–app ,使用 | 或者,分隔，在命令行里使用时，这两个是等价的，区别是后者可以在程序里通过回调获取到；第二个为描述, 会在 help 信息里展示出来；第三个参数为回调函数，他接收的参数为一个string，有时候我们需要一个命令行创建多个模块，就需要一个回调来处理；第四个参数为默认值
* action – 注册一个callback函数,这里需注意目前回调不支持let声明变量
* parse – 解析命令行

```
import program from 'commander';
import pkg from '../package.json';
import execa from 'execa';

var gulp = require('gulp');
var imagemin = require('gulp-imagemin')

export function cli(args) {

    program.version(pkg.version, '-V, --version').usage('<command> [options]');


    program
        .command('tinypng')
        .description('tinypng')
        .action(async function() {
          const { stdout: pwd } = await execa('pwd');
            gulp.src(pwd + '/*')//需要压缩的图片放在这个路径下
                .pipe(imagemin([
                    imagemin.gifsicle({interlaced: true}),
                    imagemin.jpegtran({progressive: true}),
                    imagemin.optipng({optimizationLevel: 10}),
                    imagemin.svgo({
                        plugins: [
                            {removeViewBox: true},
                            {cleanupIDs: false}
                        ]
                    })
                ]))
                .pipe(gulp.dest('dist'));//压缩完成的图片放在这个路径下
            });

            program.parse(args);

}
```

这里有注意事项，在运行的最后必须写一条解析命令行（program.parse(args)），我的理解是每次执行的一个命令行，它内部的cli函数都是重新走一遍，所以也必然是需要找对应执行的函数。


最后下面上[git地址](https://github.com/tzzf/toolcli)

 ----
  ###### 参考
  * [commander](https://aotu.io/notes/2016/08/09/command-line-development/index.html)
  * [烹饪一道美味的 CLI](https://juejin.im/post/5db9bbc0518825646350037c)