const _NODE_ENV = process.env.NODE_ENV === 'production';
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  devServer: {
    proxy: {
      // proxy all requests starting with /api to jsonplaceholder
      '/browser-desktop-server-api': {
        target: 'http://127.0.0.1:20000', // 代理接口
        changeOrigin: true,
        pathRewrite: {
          '^/browser-desktop-server-api': '/browser-desktop-server-api' // 代理的路径
        }
      }
    }
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      return {
        plugins: [
          new CompressionWebpackPlugin({
            // filename: "[path].gzip[query]", // 提示compression-webpack-plugin@2.0.0的话filename改为asset
            // algorithm: "gzip",
            test: /\.js$|\.html$|\.css/,
            threshold: 10240, //内容超过10KB进行压缩
            deleteOriginalAssets: false,
            // minRatio: 0.8
          })
        ]
      };
    }
  },

  chainWebpack: (config) => {
    if (_NODE_ENV) {
      config.optimization.splitChunks({
        cacheGroups: {
          common: {//commons 一般是是个人定义的
            name: 'chunk-common', // 打包后的文件名
            chunks: 'initial',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true
          },
          vendors: {//vendor 是导入的 npm 包
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            maxSize: 300000,
            maxInitialRequests: 20,
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          antDesignVue: {//把antDesignVue从chunk-vendors.js提取出来。当然我们也可以把mixins，vue.min.js等等也按照类似配置提取出来
            name: 'chunk-ant-design-vue',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            chunks: 'initial',
            priority: 3,
            maxSize: 600000,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      })
    }
  },

  // 设为false打包时不生成.map文件
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
  runtimeCompiler: true,
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: '',
  publicPath: '/',
  // indexPath: 'json.ftl',
};
