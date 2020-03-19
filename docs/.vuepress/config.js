// .vuepress/config.js

module.exports = {
    // 网站 Title
    title: 'My Blog',
  
    // 网站描述
    description: 'This is my blog',

    head: [
      ['script', { 
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        async: '',
        'data-ad-client': 'ca-pub-1349025622776740',
      }],
      ['ins', { 
        class: 'adsbygoogle',
        style: 'display:block; text-align:center;',
        'data-ad-layout': 'in-article',
        'data-ad-format': 'fluid',
        'data-ad-client': 'ca-pub-1349025622776740',
        'data-ad-slot': '2782786609',
      }],
      ['ins', { 
        class: 'adsbygoogle',
        style: 'display:block;',
        'data-full-width-responsive': 'true',
        'data-ad-format': 'auto',
        'data-ad-client': 'ca-pub-1349025622776740',
        'data-ad-slot': '8657929817',
      }],
      ['script', {}, '(adsbygoogle = window.adsbygoogle || []).push({})'],
    ],
  
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
        // organization: '',
  
        // 头像
        avatar: 'https://s2.ax1x.com/2019/02/15/kD5mqK.jpg',
  
        // 社交平台帐号信息
        sns: {
          // Github 帐号和链接
          github: {
            account: 'meteorlxy',
            link: 'https://github.com/tzzf',
          },
  
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
        repo: 'tzzf09',
        clientId: 'bee11121fee7927424f9',
        clientSecret: 'c377cc9c8b6af3e37232e4ce69928bc05581d3ed',
      },
    },
  }