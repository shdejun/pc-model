'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

//获取项目运行dir绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  //context 当前目录的绝对路径
  context: path.resolve(__dirname, '../'),
  //entry 入口文件 src下的main.js文件
  entry: {
    app: './src/main.js'
  },
  //输出内容
  output: {
    //生产环境默认 path.resolve(_dirname,'../dist')
    path: config.build.assetsRoot,
    //出口js文件名 [name] = entry.app  [name].js = app.js
    filename: '[name].js',
    //根index.html 资源引入根路径 
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  //webpack在启动后会从配置的入口找出所依赖的模块
  resolve: {
    //在导入语句没带文件后缀时,webpack会自动带上后缀去尝试访问文件是否存在
    extensions: ['.js', '.vue', '.json','.jsx'],
    //alias 化名 映射 配置项通过别名把导入路径映射成一个新的导入路径
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      //src的绝对路径 可以用'@或者-@表示'
      '@': resolve('src'),
      '-@':resolve('src')
    }
  },
  //处理不同模块的选项和配置
  module: {
    //rules Array 创建模块时，匹配请求的规则数组
    rules: [
      {
        //处理.vue后缀的文件配置
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        //主要解析.js后缀文件 es6语法
        test: /\.js$/,
        loader: 'babel-loader',
        //指定处理包含以下绝对路径下的.js文件
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        //url-loader
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // url-loader封装了file-loader，但url-loader并不依赖于file-loader。
          //url-loader通过limit属性对图片分情况处理，当小于limt(单位:byte)大小时转base64，大于则调用file-loader处理
          limit: 10000,
          //静态资源文件 默认绝对路径下static/img的文件
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // 防止webpack注入无用的默认行为，因为Vue源包含了它(尽管只有在它是原生的时候才使用它)。
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
