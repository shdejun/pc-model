'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
//process对象是一个node的全家变量，提供相关信息，控制node.js进程 无需require()
//域名 和 端口
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//开发环境的webpack配置项
const devWebpackConfig = merge(baseWebpackConfig, {
  //开发环境处理模块的规则
  module: {
    //合并开发环境需要的style loaders
    rules: utils.styleLoaders(
      { sourceMap: config.dev.cssSourceMap, usePostCSS: true }
    )
  },
  //优化开发环境
  devtool: config.dev.devtool,

  // webpack-dev-server创建一个静态资源的服务用于开发环境，使用它可以为webpack打包生成的资源文件提供web服务。
  // devServer是webpack-dev-server的具体配置项
  devServer: {
    //当使用inline mode时，开发者工具控制台显示消息的模式
    clientLogLevel: 'warning',

    //单页应用(SPA)一般只有一个index.html,导航的跳转都是基于HTML5 History API,
    //so 当越过index.html页面直接访问这个地址或者通过浏览器刷新按钮重新获取时，就会出现404问题
    //比如直接访问/login,/login/online,这个时候就越过了index.html,去查找下个文件的地址，应为单页应用，最终结果肯定失败，返回一个404
    //
    historyApiFallback: {
      //如果404重写路径=开发环境的/index.html
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    //是否启用webpack的热替换特性 
    hot: true,
    //告诉服务器从哪里获取静态资源，因为已经使用了CopyWebpackPlugin插件拷贝了static的静态资源，所以设置为false
    contentBase: false, 
    //一切服务都启用gzip压缩
    compress: true,
    //制定一个域名host 默认为node环境中的全局变量 process.env.HOST 或者使用config文件dev环境配置好的host
    host: HOST || config.dev.host,
    //制定一个端口port 默认为node环境中的全局变量 process.env.PORT 或者使用config文件dev环境配置好的port
    port: PORT || config.dev.port,
    //是否服务开启后自动打开浏览器 webpack-dev-server --open 'Google Chrome'
    open: config.dev.autoOpenBrowser,
    //当编译器错误或警告时，在浏览器中显示全屏覆盖。开发环境使用
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    //次路径下的打包文件可在浏览器访问
    publicPath: config.dev.assetsPublicPath,
    //代理后台服务的一些配置for {"/api":"代理服务的地址"}
    proxy: config.dev.proxyTable,
    //启动服务后，除了出事启动信息之外的任何内容都不会被打印到控制台。这也意味来自webpack的错误或警告在控制台不可见
    quiet: true, // necessary for FriendlyErrorsPlugin
    //监测相关文件的控制选项
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  //使用的一些plugins及其配置项
  plugins: [
    //definePlugin 设置一些全局变量的插件
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    //hotModeuleReplacementPlugin 代码热替换插件
    new webpack.HotModuleReplacementPlugin(),
    //nameModulesPlugin这个插件的左右是热替换插件执行后返回更新的文件名
    new webpack.NamedModulesPlugin(), 
    //webpack编译出现错误的时候使用该插件，跳过输出阶段
    new webpack.NoEmitOnErrorsPlugin(),
    // HtmlWebpackPlugin 插件
    //1.创建一个html入口文件，单页一个 多页多个
    //2.为html文件中引入的外部资源如script,link动态添加每次编译后的hash值，防止引用缓存的外表问题。
    new HtmlWebpackPlugin({
      //输出的html文件名称
      filename: 'index.html',
      //html模板所在的文件路径
      template: 'index.html',
      //script文件注入方式
      //1 true body底部，2body 3head 4false 不插入js文件
      inject: true
    }),
    // copy插件拷贝静态资源文件static不会被打包
    new CopyWebpackPlugin([
      {
        //复制的文件目录
        from: path.resolve(__dirname, '../static'),
        //黏贴的文件目录
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
//portfinder 获取当前可用的端口port （一旦端口被占用，保持，再次运行的时候会打开:port + 1..port + n）
module.exports = new Promise((resolve, reject) => {
  //基本端口
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      //设置node 全局变量process..env的端口
      process.env.PORT = port
      //设置开发环境配置项中的webpack-dev-server插件配置中的端口
      devWebpackConfig.devServer.port = port

      // 配置提示插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
