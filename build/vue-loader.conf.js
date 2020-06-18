'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  //开启热重载
  hotReload:true,
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  //cssSourceMap-Boolean 是否开启css maps，关闭可以避免css-loader 的some relative path related bugs 同时可以加快构建速度
  cssSourceMap: sourceMapEnabled,
  //cacheBusting-Boolean 缓存破坏属性 在sourceMap Debug时 设置成false,非常有用
  cacheBusting: config.dev.cacheBusting,
  //在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为 require 调用，以便目标资源可以由 webpack 处理。默认配置会转换 <img> 标签上的 src 属性和 SVG 的 <image> 标签上的 xlink：href 属性。
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
