const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  // mode: 'production',
  entry: {
    main: './main.js',
  },
  output: {
    filename: 'js/[name].js',
  },
  // 单独引vue.js，处理require('vue')问题
  externals: {
    vue: 'Vue',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.scss$/,
        loaders: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        loaders: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        // options: {
        //   limit: 10000,
        //   name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        // }
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new WebpackBar(),
    // 清理
    // new CleanWebpackPlugin({}),
    // HTML
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
  //...
  devServer: {
    disableHostCheck: true,
    port: 8001,
    open: true,
    contentBase: './public/',
  },
}
