const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 分离样式文件,以link的方式引入
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // (cross-env 设置的环境变量)

const config = {
    mode: 'development', // 模式
    entry: './src/index.js', // 打包入口地址
    output: {
        filename: 'bundle.[contenthash].js', // 输出文件名
        path: path.join(__dirname, 'dist') // 输出文件目录
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public')
        }, // 静态文件目录
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        open: true  // 是否自动打开浏览器
    },
    // devtool: 'source-map',
    module: {
        rules: [ // 转换规则
            {
                test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css  文件
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader, // 添加 loader
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],    // use: 对应的 Loader 名称
                //postcss-loader 添加浏览器前缀需要配合 postcss.config.js 及 .browserslistrc
            },
            // 【图片】
            // webpack5内置了资源模块（assets），可以自己处理资源文件（图片、字体等） https://www.jianshu.com/p/558cd247822d
            {
                test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
                type: 'asset',
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
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                        }
                    }
                ]
            },
        ]
    },
    plugins: [ // 配置插件
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(), // 打包前清空
        new MiniCssExtractPlugin({ // 添加插件
            filename: '[name].[hash:8].css'
        }),
    ]
}

module.exports = (env, argv) => {
    console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值（webpack中设置参数）
    // 这里可以通过不同的模式修改 config 配置
    return config;
}
