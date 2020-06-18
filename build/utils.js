'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

//兼容默认（static）的绝对路径
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

//获取css相关的loaders
exports.cssLoaders = function (options) {
  options = options || {}
//scc-loader
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
//postcss-loader
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

/**
 * function 形成loader
 * @param {*String } loader loader的名称
 * @param {*Object} loaderOptions  loader的配置对象
 */
  function generateLoaders (loader, loaderOptions) {
    //loaders loader[]数组 
    //如果 配置对象的usePostCSS=true 则使用postcss-loader和css-loader,或者只是有css-loader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    //如果loader存在则Push其他loader
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          //是否源解析
          sourceMap: options.sourceMap
        })
      })
    }

 
    if (options.extract) {
      //该插件主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
      return ExtractTextPlugin.extract({
        //use 编译前 使用什么loader
        use: loaders,
        //编译后用什么loader来提取css文件
        fallback: 'vue-style-loader'
      })
    } else {
      //vue-style-loader拼接传入的loader + 默认loader
      return ['vue-style-loader'].concat(loaders)
    }
  }

  //cssLoaders函数返回相应的css loaders数组【】
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

//拓展的loaders
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  //extension 拓展
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

//通知错误回调函数
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
