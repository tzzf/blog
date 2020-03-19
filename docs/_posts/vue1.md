---
tags:
  - vue
date: 2020-02-19
title: Prettier提升代码规范
vssue-title: Prettier提升代码规范
---

Prettier提升代码规范

<!-- more -->

## 痛点

在个人学习成长过程或者项目迭代中，经常会写一些千奇百怪的代码为了实现一些功能或者效果。为了挽回这些“错误”代码，那么需要将这些代码进行格式化。Prettier是代码格式工具。下面我就会用这个来提升格式代码效率。

## prettier + eslint 使用

众所周知eslint只是检查代码并提示，格式化代码的功能比较有限。所以就需要用Prettier来格式化代码。
<br />
下面我就用之前写的练习组件库的项目（此项目非vue-cli生成，所以在可能插件并不能通用在vue-cli生成项目）来举举例子。
<br />
我原项目已经集成了eslint，所以我就不安装了

```
yarn add --dev eslint-plugin-prettier eslint-config-prettier prettier-eslint-cli
```

<br >
安装以上插件，然后配置.eslintrc.js
<br />

```
module.exports = {
  ....
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended"
  ],
  ...
};

```

eslint-plugin-prettier 插件，可以让eslint使用prettier规则进行检查，并使用--fix选项。这个插件是依赖eslint-plugin-prettier 和 eslint-config-prettier。

<br />

然后就是添加npm script 脚本流。

```
{
  "scripts": {
    "eslint-fix": "eslint packages/**/**/*.vue  examples/**/**/*.vue --fix"",
  }
}
```

运行 yarn eslint-fix 就可以格式化代码了。
<br >

现在已经可以格式化代码。当然只是做到这个是不够的。我们还需要pre-commit Hook 约束代码提交，不仅仅只是让你之前的代码没有问题，还要让你之后提交的代码都会被格式化。我们可以使用插件husky和lint-staged来规范

<br />

```
yarn add lint-staged husky --dev


"lint-staged": {
    "**/**.{js,css,vue}": [
      "prettier --write", // 先使用prettier进行格式化
      "eslint --fix", // 再使用eslint进行自动修复
      "git add" // 所有通过的话执行git
    ]
},
"husky": {
    "hooks": {
      "pre-commit": "lint-staged" // pre-commit，提交前的钩子
    }
}
```

[prettier更新commit](https://github.com/tzzf/zzfui/commit/fe449ef8dfbad750271f9b5aebcde92bea3ef4e3)

<br >
这样以后写代码就不用担心自己的写代码不规范了，若是你想要自己更改规范的话，就在根目录生成.prettierrrc文件，自己定义写。


## 总结

遇到一些重复性操作的流程，有在一定的时间的情况下，一定要去尝试去用自动化工具来解决这些问题。







