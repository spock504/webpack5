# webpack5
webpack5 常用配置

构建 webpack5.x 知识体系
参考链接：https://juejin.cn/post/7023242274876162084

1. css兼容: 添加浏览器前缀
```bash
npm install postcss postcss-loader postcss-preset-env -D
```
postcss-loader 添加浏览器前缀需要配合 postcss.config.js 及 .browserslistrc

2. 分离样式：以link的方式将css引入
```bash
npm install mini-css-extract-plugin -D
```
3. 静态文件：图片、字体
 配置：`type: 'asset',`
 webpack5内置了资源模块（assets），可以自己处理资源文件（图片、字体等） https://www.jianshu.com/p/558cd247822d

 4. js兼容
```bash
npm install babel-loader @babel/core @babel/preset-env -D
```
- `babel-loader` 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
- `@babel/core` Babel 编译的核心包
- `@babel/preset-env` Babel 编译的预设，可以理解为 Babel 插件的超集
根目录下新增 `.babelrc.js`，将 Babel 配置文件提取出来。 

插件: 增加装饰器
> 下载：`npm install @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D`
> 配置：`.babelrc.js` 加上插件的配置

5. sourceMap
- 本地开发：

推荐：`eval-cheap-module-source-map`
理由：本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快开发中
`cheap`: 我们每行代码不会写的太长，只需要定位到行就行
`modele`: 我们希望能够找到源代码的错误，而不是打包后的


- 生产环境：

推荐：(none)
理由：就是不想别人看到我的源代码

6. hash 值
例如我们在基础配置中用到的：`filename: "[name][hash:8][ext]"`

|  占位符   | 解释  |
|  ----  | ----  |
| ext  | 文件后缀名 |
| name  | 文件名 |
| path  | 文件相对路径 |
| folder  | 文件所在文件夹 |
| hash  | 每次构建生成的唯一 hash 值 |
| chunkhash  | 根据 chunk 生成 hash 值 |
| contenthash  | 根据文件内容生成hash 值 |
hash、chunkhash、contenthash 的区别：
- hash ：任何一个文件改动，整个项目的构建 hash 值都会改变；
- chunkhash：文件的改动只会影响其所在 chunk 的 hash 值；
- contenthash：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；


