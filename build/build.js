'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

//ora 一个用于Node终端（命令行）加载动画以及图标的工具
const ora = require('ora')
//rimaraf rimaraf somthing 删除文件或者文件夹的，不管文件夹是否为空，都能删除
const rm = require('rimraf')
//node的path模块，提供一些工具函数，用于处理文件与目录的路径
const path = require('path')
//chalk 用于修改控制台中的字符串的样式（字体加粗/颜色/背景颜色）
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

//先删除dist文件夹
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  //如果有错误 抛出错误
  if (err) throw err
  //执行打包命令
  webpack(webpackConfig, (err, stats) => {
    //动画停止
    spinner.stop()
    //如果有错误，抛出错误
    if (err) throw err
    //node 中的 process.stdout.write 可以显示一个对象。 console.log 显示字符串 （区别）
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      //如果有错误则退出进程
      process.exit(1)
    }
    //控制台打印一些醒目的提示文字
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
