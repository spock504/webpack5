# webpack5
webpack5 常用配置

构建 webpack5.x 知识体系

1. css兼容: 添加浏览器前缀
```bash
npm install postcss postcss-loader postcss-preset-env -D
```
postcss-loader 添加浏览器前缀需要配合 postcss.config.js 及 .browserslistrc

2. 分离样式：以link的方式将css引入
```bash
$ npm install mini-css-extract-plugin -D
```
3. 静态文件：图片、字体
 配置：`type: 'asset',`
 webpack5内置了资源模块（assets），可以自己处理资源文件（图片、字体等） https://www.jianshu.com/p/558cd247822d


