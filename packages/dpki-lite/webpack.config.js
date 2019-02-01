const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'testing-module/js/'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'add'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
  ]
}
