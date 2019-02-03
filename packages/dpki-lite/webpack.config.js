const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// var AsyncAwaitPlugin = require('webpack-async-await') ;
// var options = { }
module.exports = {
  entry: ['babel-polyfill', './lib/index.js'],
  output: {
    path: path.resolve(__dirname, 'js/'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
    // new AsyncAwaitPlugin(options)
    new HtmlWebpackPlugin(),
  ]
}
