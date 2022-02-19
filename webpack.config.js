const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 分离样式文件,以link的方式引入
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); // 构建费时分析
// const smp = new SpeedMeasurePlugin();
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin') // 清理无效css
const glob = require('glob'); // 文件匹配模式

console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // (cross-env 设置的环境变量)

// 路径处理方法
function resolve(dir) {
    return path.join(__dirname, dir);
}

const PATHS = {
    src: resolve('src')
}

const config = {
    mode: 'development', // 模式
    entry: './src/index.js', // 打包入口地址
    output: {
        filename: 'bundle.[contenthash].js', // 输出文件名
        path: path.join(__dirname, 'dist') // 输出文件目录
    },
    devServer: {
        compress: true, //是否启动压缩 gzip
        port: 8085, // 端口号
        open: true  // 是否自动打开浏览器
    },
    resolve: {
        // 配置别名
        alias: {
            '~': resolve('src'),
            '@': resolve('src'),
            'components': resolve('src/components'),
        },
        // 在import 文件时文件后缀名可以不写，尝试按顺序解析这些后缀名；'...'扩展运算符代表默认配置
        // extensions: ['.js', '.json', '...'],
        //  解析模块时应该搜索的目录
        modules: [resolve('src'), 'node_modules'],
    },
    // externals:从输出的 bundle 中排除依赖：（从cdn引入，打包的时候就可以排除这个依赖了）
    externals: {
        jquery: 'jQuery', // 排除jquery模块，jQuery 作为全局变量
    },
    // devtool: 'source-map',
    module: {
        // 不需要解析依赖的第三方大型类库，以提高构建速度
        noParse: /jquery|lodash/,
        // 转换规则
        rules: [
            {
                test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css  文件
                include: resolve('src'), // 缩小范围
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader, // 分离样式文件， 添加 loader
                    'cache-loader', // 获取前面 loader 转换的结果
                    'css-loader',
                    'postcss-loader', //postcss-loader 添加浏览器前缀需要配合 postcss.config.js 及 .browserslistrc
                    'sass-loader'
                ],    // use: 对应的 Loader 名称
            },
            // 【图片】
            // webpack5内置了资源模块（assets），可以自己处理资源文件（图片、字体等） https://www.jianshu.com/p/558cd247822d
            {
                test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
                type: 'asset',
                include: resolve('src'),
                exclude: /node_modules/,
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, //如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中
                    }
                },
                generator: {
                    filename: 'static/img/[hash].[ext]', // 输出文件位置以及文件名
                }
            },
            // 【字体文件】
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                type: 'asset',
                include: resolve('src'),
                exclude: /node_modules/,
                generator: {
                    // 输出文件位置以及文件名
                    filename: "font/font/[name][hash:8][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 超过100kb不转 base64
                    }
                }
            },
            // 图片loader方式配置
            // {
            //     test: /\.(jpe?g|png|gif)$/i,
            //     type: 'javascript/auto',
            //     loader: 'file-loader',
            //     options: {
            //         esModule: false, //解决html区域,vue模板引入图片路径问题 
            //         limit: 1000, 
            //         name: "[name].[hash:8].[ext]",
            //     }
            // },
            {
                test: /\.js$/i,
                include: resolve('src'),
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: 'thread-loader', // 开启多进程打包
                    //     options: {
                    //         worker: 3,
                    //     }
                    // },
                    // JS 兼容性处理 babel
                    // .babelrc.js：将 Babel 配置文件提取出来
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 启用缓存
                            presets: [
                                '@babel/preset-env' // Babel 编译的预设，可以理解为 Babel 插件的超集
                            ],
                        }
                    }
                ]
            },
        ],
    },
    plugins: [ // 配置插件
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(), // 打包前清空
        new MiniCssExtractPlugin({ // 添加插件
            filename: '[name].[hash:8].css'
        }),
        // 忽略 Moment 语言环境，将插件中的非中文语音排除掉
        // https://webpack.docschina.org/plugins/ignore-plugin
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        // new BundleAnalyzerPlugin({
        //     // analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
        //     // generateStatsFile: true, // 是否生成stats.json文件
        // })
    ],
    // 在生成环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。
    optimization: {
        minimize: true, // 开启最小化
        minimizer: [
            new OptimizeCssAssetsPlugin({}), // 添加 css 压缩配置
            new TerserPlugin({}), // js压缩
            new PurgecssWebpackPlugin({
                paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
            }), // 清理无效css
        ],
        //  分包配置
        // splitChunks: {
        //     cacheGroups: { // 配置提取模块的方案
        //         default: false,
        //         styles: {
        //             name: 'styles',
        //             test: /\.(s?css|less|sass)$/,
        //             chunks: 'all',
        //             enforce: true,
        //             priority: 10,
        //         },
        //         common: {
        //             name: 'chunk-common',
        //             chunks: 'all',
        //             minChunks: 2,
        //             maxInitialRequests: 5,
        //             minSize: 0,
        //             priority: 1,
        //             enforce: true,
        //             reuseExistingChunk: true,
        //         },
        //         vendors: {
        //             name: 'chunk-vendors',
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: 'all',
        //             priority: 2,
        //             enforce: true,
        //             reuseExistingChunk: true,
        //         },
        //         // ... 根据不同项目再细化拆分内容
        //     },
        // },
    }
}

module.exports = (env, argv) => {
    console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值（webpack中设置参数）
    // 这里可以通过不同的模式修改 config 配置
    return config;
}
