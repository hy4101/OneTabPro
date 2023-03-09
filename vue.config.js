const pagesObj = {};

const chromeName = ['options'];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: `src/${name}/index.html`,
    filename: `${name}.html`
  };
});

module.exports = {
  pages: pagesObj,
  productionSourceMap: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
    return {

      resolve: {
        // symlinks: false
        // alias: {
        //   'vue$': 'vue/dist/vue.runtime.js'
        // },
      },
      entry: {
        '../service_worker': './src/service_worker.js'
      },
      output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
      },
      // module: {
      //   rules: [
      //     {
      //       test: /.vue$/,
      //       loader: 'vue-loader'
      //     }
      //   ]
      // },
      // plugins: [
      //   new VueLoaderPlugin()
      // ],
      devtool: "cheap-source-map",
      // devtool: "inline-source-map",
      // plugins: [CopyWebpackPlugin(plugins)]
      // 打包不压缩代码,
      // optimization: {
      //   minimize: false,
      //   minimizer: [new UglifyJsPlugin({
      //     uglifyOptions: {
      //       minimize: false,
      //       compress: false,
      //       beautify: true,
      //       mangle: false // Note `mangle.properties` is `false` by default.
      //     }
      //   })]
      // },
    }
  },
  css: {
    extract: {
      filename: 'css/[name].css'
      // chunkFilename: 'css/[name].css'
    }
  }
  // chainWebpack: config => {
  //   // 查看打包组件大小情况
  //   if (process.env.npm_config_report) {
  //     // 在运行命令中添加 --report参数运行， 如：npm run build --report
  //     config
  //       .plugin('webpack-bundle-analyzer')
  //       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  //   }
  // }
};
