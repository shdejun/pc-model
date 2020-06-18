'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')

//生产环节配置
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    //合拼生产环境的styleLoaders
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      //使用ExtractTextPlugin插件 区别去开发环境
      extract: true,
      //使用postcss-loader
      usePostCSS: true
    })
  },
  // Webpack打包生成的.map后缀文件 
  //当javaScript异常抛出的时，你会想知道错误发生在那个文件哪一行，为了追踪方便，所有使用了source-map
  //生产环节 source map 一般使用选项source-map  开发环境使用cheap-module-eval-source-map
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  //打包出口配置项
  output: {
    //通过HtmlWebpackPlugin插件生成的html文件存放在这个目录下面
    path: config.build.assetsRoot,
    //编译生成的js文件存放在跟目录下面的js目录下面，如果js目录不存在则自动创建
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    /*
      *chunkFilename用来打包require.ensure方法中引入的模块，如果则不会生成任何chunk块文件
      *比如在main.js文件中,require.ensure([],function(require){alert(11);}),这样不会打包块文件
      *只有这样才会打包生成块文件require.ensure([],function(require){alert(11);require('./greeter')})
    */
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    //定义node 全局变量的插件
    new webpack.DefinePlugin({
      'process.env': env
    }),
    //js 压缩插件 需要node 6.9.0 webpack 4.0.0版本以上
    new UglifyJsPlugin({
      //UglifyJS 压缩选项
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      //使用sourceMap将错误消息位置映射到模块(这会减慢编译速度)
      sourceMap: config.build.productionSourceMap,
      //parallel使用多进程并行运行来提高构建速度。
      parallel: true
    }),
    //抽离css插件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
    }),
    //OptimizeCSSPlugin 优化或者压缩css
    //cssProcessorOptions 用于压缩和优化css的处理器
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    //创建生成html入口文件,
    new HtmlWebpackPlugin({
      //文件名
      filename: config.build.index,
      //html模板所在的文件路径
      template: 'index.html',
      //注入选项
      inject: true,
      //minify 的作用是对html文件进行压缩,压缩选项或者false,默认值为false
      minify: {
        //是否移除注释 yes
        removeComments: true,
        ///删除空白符与换行符 yes
        collapseWhitespace: true,
        //是否移除属性的引号 yes
        removeAttributeQuotes: true,
        //是否对大小写敏感，默认false
        caseSensitive: false,
        //是否去除空格，默认false
        collapseWhitespace: false,
        //删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
        removeScriptTypeAttributes: false,
        //删除style的类型属性， type="text/css" 同上
        removeStyleLinkTypeAttributes: false,
        //使用短的文档类型，默认false
        useShortDoctype: false,
      },
      chunksSortMode: 'dependency'
    }),
    // hashedModuleIdsPlugin插件会根据模块的相对路径生成一个四位数的hash作为模块id,适用与生产环境
    new webpack.HashedModuleIdsPlugin(),
    //过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。
    //这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
    //这个插件会在 webpack 中实现以上的预编译功能。
    new webpack.optimize.ModuleConcatenationPlugin(),
    //CommonsChunkPlugin 是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。
    //已经从 webpack v4 legato
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 提取webpack运行时和模块清单到它自己的文件中
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      // 随着 entry chunk 越来越多，
      //这个配置保证没其它的模块会打包进 manifest chunk
      minChunks: Infinity
    }),
    // 这个配置插件的作用是从代码分解块中提取共享块，并将它们捆绑在一个单独的块中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      // async如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
      // 它会与 `options.chunks` 并行被加载。
      async: 'vendor-async',
      //children 如果设置为true,所有公共chunk的字模块都会被选中
      children: true,
      //在传入公共chunk之前需要包含的最少数量的chunkes option: number|Infinity|function(module, count) -> boolean,
      minChunks: 3
    }),

    // 将单个文件或者整个目录复制到构建目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

//如果config.prod中productionGzip == true 是否压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// analyzer分析 项目分析插件 npm run build --report option 一般无需配置
// 根据文件体积去优化代码
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
