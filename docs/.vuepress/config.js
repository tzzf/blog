// .vuepress/config.js

module.exports = {
    // 网站 Title
    title: 'My Blog',
  
    // 网站描述
    description: 'This is my blog',
  
    // 网站语言
    locales: {
      '/': {
        lang: 'zh-CN',
      },
    },
  
    // 使用的主题
    theme: 'vuepress-theme-meteorlxy',
  
    // 主题配置
    themeConfig: {
      // 个人信息（没有或不想设置的，删掉对应字段即可）
      personalInfo: {
        // 昵称
        nickname: 'tzzf',
  
        // 个人简介
        description: 'zzzZZZ',
  
        // 电子邮箱
        email: 'tzzf09@193.com',
  
        // 所在地
        location: 'Hangz\'zhou City, China',
  
        // 组织
        // organization: 'Xi\'an Jiao Tong University',
  
        // 头像
        avatar: 'https://s2.ax1x.com/2019/02/15/kD5mqK.jpg',
  
        // 社交平台帐号信息
        sns: {
          // Github 帐号和链接
          github: {
            account: 'meteorlxy',
            link: 'https://github.com/tzzf',
          },
  
        //   // Facebook 帐号和链接
        //   facebook: {
        //     account: 'meteorlxy.cn',
        //     link: 'https://www.facebook.com/meteorlxy.cn',
        //   },
  
        //   // LinkedIn 帐号和链接
        //   linkedin: {
        //     account: 'meteorlxy',
        //     link: 'http://www.linkedin.com/in/meteorlxy',
        //   },
  
        //   // Twitter 帐号和链接
        //   twitter: {
        //     account: 'meteorlxy_cn',
        //     link: 'https://twitter.com/meteorlxy_cn',
        //   },
  
        //   // 新浪微博 帐号和链接
        //   weibo: {
        //     account: '@焦炭君_Meteor',
        //     link: 'https://weibo.com/u/2039655434',
        //   },
  
        //   // 知乎 帐号和链接
        //   zhihu: {
        //     account: 'meteorlxy.cn',
        //     link: 'https://www.zhihu.com/people/meteorlxy.cn',
        //   },
  
        //   // 豆瓣 帐号和链接
        //   douban: {
        //     account: '159342708',
        //     link: 'https://www.douban.com/people/159342708',
        //   },
        },
      },
  
      // 上方 header 的背景，可以使用图片，或者随机变化的图案
      headerBackground: {
        // 使用图片的 URL，如果设置了图片 URL，则不会生成随机变化的图案，下面的 useGeo 将失效
        // url: '/assets/img/bg.jpg',
  
        // 使用随机变化的图案，如果设置为 false，且没有设置图片 URL，将显示为纯色背景
        useGeo: true,
      },
  
      // 是否显示文章的最近更新时间
      lastUpdated: true,
  
      // 顶部导航栏内容
      nav: [
        { text: 'Home', link: '/', exact: true },
        { text: 'Posts', link: '/posts/', exact: false },
      ],
  
      // 评论配置，参考下方 [页面评论] 章节
      comments: {
        owner: 'tzzf',
        repo: 'tzzf.github.io',
        clientId: '7f2f84be3afbb5a11908',
        clientSecret: 'e305dbcb3155213ab1b1211d694939c5aaa15203',
      },
    },
  }