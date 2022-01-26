# webpack5
webpack5 常用配置

构建 webpack5.x 知识体系
参考链接：https://juejin.cn/post/7023242274876162084
### 一、基础配置

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

| 占位符      | 解释                       |
| ----------- | -------------------------- |
| ext         | 文件后缀名                 |
| name        | 文件名                     |
| path        | 文件相对路径               |
| folder      | 文件所在文件夹             |
| hash        | 每次构建生成的唯一 hash 值 |
| chunkhash   | 根据 chunk 生成 hash 值    |
| contenthash | 根据文件内容生成hash 值    |
hash、chunkhash、contenthash 的区别：
- hash ：任何一个文件改动，整个项目的构建 hash 值都会改变；
- chunkhash：文件的改动只会影响其所在 chunk 的 hash 值；
- contenthash：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；


### 二、优化构建速度
1. modules ：告诉webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间

```js
resolve: {
        // 配置别名
        alias: {
            '~': resolve('src'),
            '@': resolve('src'),
            'components': resolve('src/components'),
        },
        // 在import 文件时文件后缀名可以不写，尝试按顺序解析这些后缀名；'...'扩展运算符代表默认配置
        extensions: ['.js', '.json', '...'],
        //  解析模块时应该搜索的目录
        modules: [resolve('src'), 'node_modules'],
    },
```
2. externals ：从输出的 bundle 中排除依赖

```js
 externals: {
    jquery: 'jQuery',
  },
```
3. noParse：使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法
```js
 module: { 
    noParse: /jquery|lodash/,
    rules:[...]
  }
```
4. IgnorePlugin

将插件中的非中文语音排除掉
```js
// 引入 webpack
const webpack = require('webpack')

const config = {
  ...
  plugins:[ // 配置插件
    ...
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ]  
};
```
5. 使用缓存

 babel-loader 通过`cacheDirectory：true `开启

```js
{
    test: /\.js$/i,
    loader: 'babel-loader',
    use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // 启用缓存
            }
          },
        ]
},

```
其他loader通过`cache-loader` 缓存一些性能开销比较大的 loader 
```js
{
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'cache-loader', // 获取前面 loader 转换的结果
          'css-loader',
          'postcss-loader',
          'sass-loader', 
        ]
}, 

```

> webpack5中不建议的方式
> - **hard-source-webpack-plugin** 
>   为模块提供了中间缓存，重复构建时间大约可以减少 80%，但是在 webpack5 中已经内置了模块缓存，不需要再使用此插件
> - **dll**
> 在 webpack5.x 中已经不建议使用这种方式进行模块缓存，因为其已经内置了更好体验的 cache 方法

### 三、优化构建结果
1. 压缩 CSS

```js
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// ...

const config = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
    ]
  },
 // ...
}
```
2. 压缩js
  
> 在生成环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。
> 
因为 webpack5 内置了terser-webpack-plugin 插件,所以可以直接引用
```js
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // ...
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({})
    ]
  },
  // ...
}
```
3.  清除无用的 CSS
  `main.css` 中定义了 .unused 未使用的样式，就不会打包进去
```js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式
// ...

function resolve(dir){
  return path.join(__dirname, dir);
}

const PATHS = {
  src: resolve('src')
}

const config = {
  plugins:[ // 配置插件
    // ...
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    }),
  ]
}
```
4.  Tree-shaking ：剔除没有使用的代码，以降低包的体积
  
