import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  title: 'GameMaker China Forum',
  description: 'GameMaker China Forum\'s mainpage and documents',
  bundler: viteBundler(),
  theme: recoTheme({
    style: '@vuepress-reco/style-default',
    logo: '/images/logo.png',
    author: 'GameMaker 开发者之家',
    authorAvatar: '/images/logo.png',
    docsRepo: 'https://github.com/GamemakerChina/mainpage',
    docsBranch: 'main',
    docsDir: '',
    primaryColor: '#509112',
    lastUpdatedText: '',
    // series 为原 sidebar
    series: {
      '/docs/theme-reco/': [
        {
          text: 'module one',
          children: ['home', 'theme']
        },
        {
          text: 'module two',
          children: ['api', 'plugin']
        }
      ]
    },
    navbar:
    [
      { text: '主页', link: '/' },
      { text: 'GM 文档',
        children: [
          { text: '汉化文档（或官方文档）', link: '/tool/manual.html'},
          { text: '汉化文档（外挂式，在线）', link: 'https://manual-plugged.gm-cn.top/' },
          { text: '汉化文档（外挂式，仓库下载）', link: 'https://github.com/GamemakerChina/manual-plugged/archive/refs/heads/main.zip' },
          { text: '汉化文档（静态式，在线）', link: 'https://manual-static.gm-cn.top/' },
          { text: '汉化文档（静态式，仓库下载）', link: 'https://github.com/GamemakerChina/manual-static/archive/refs/heads/main.zip' },
        ]
      },
      { text: '其他文档',
        children: [
          { text: 'IDE 文件汉化', link: '/docs/ide-chinese' }
        ]
      },
    ],
    bulletin: {
      // body: [
      //   {
      //     type: 'text',
      //     content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
      //     style: 'font-size: 12px;'
      //   },
      //   {
      //     type: 'hr',
      //   },
      //   {
      //     type: 'title',
      //     content: 'QQ 群',
      //   },
      //   {
      //     type: 'text',
      //     content: `
      //     <ul>
      //       <li>QQ群1：1037296104</li>
      //       <li>QQ群2：1061561395</li>
      //       <li>QQ群3：962687802</li>
      //     </ul>`,
      //     style: 'font-size: 12px;'
      //   },
      //   {
      //     type: 'hr',
      //   },
      //   {
      //     type: 'title',
      //     content: 'GitHub',
      //   },
      //   {
      //     type: 'text',
      //     content: `
      //     <ul>
      //       <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
      //       <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
      //     </ul>`,
      //     style: 'font-size: 12px;'
      //   },
      //   {
      //     type: 'hr',
      //   },
      //   {
      //     type: 'buttongroup',
      //     children: [
      //       {
      //         text: '打赏',
      //         link: '/docs/others/donate.html'
      //       }
      //     ]
      //   }
      // ],
    },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
})
