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
    
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
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
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

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

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
