'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    //镜头资源文件目录
    assetsSubDirectory: 'static',
    //定义静态资源的公共路径，也就是引用路径
    assetsPublicPath: '/',
    //代理配置，建立一个虚拟的api服务来代理本机请求，只用于开发模式
    proxyTable: {},
    host: 'localhost', 
    //devServe的端口号，可以自行更改
    port: 8080, 
    //是否自动打开浏览器
    autoOpenBrowser: true,
    //开启后，当编译器错误或警告时候，在浏览器全屏覆盖 适用于开发环境 
    errorOverlay: true,
    //浏览器控制台错题提示插件开启
    notifyOnErrors: true,
    //检查相关文件的控制选项
    poll: false, 
    //错误追踪
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    //配置一些关于样式的loader
    cssSourceMap: true
  },

  build: {
    //下面是相对路径的拼接，加入当前目录是config,那么下面的配置的index属性值就死dist/index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    //定义build后的静态资源的根目录，也就是dist目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    //定义静态资源根目录下的子目录static,也就是dist目录下的static
    assetsSubDirectory: 'static',
    ///定义静态资源的公开路径，也就是真正的引用路径
    assetsPublicPath: '/',
    //定义是否生生产生产环节的sourcemap,sourecmap是用来debug编译后文件的，通过映射到编译前文件来实现
    productionSourceMap: true,
    devtool: '#source-map',
    //时候在build后产生压缩代码，需要安装插件compression-webpack-plugin
    productionGzip: false,
    //被压缩文件的格式
    productionGzipExtensions: ['js', 'css'],
    //标定定义一个全局变量，可自行设置。npm run build --report 可以启动项目分析
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
