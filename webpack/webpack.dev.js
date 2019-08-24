const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common,
  {
    mode: 'development',
    devtool: 'eval',
    devServer: {
      historyApiFallback: true,
      contentBase: './dist',
      port: 3000,
      hot: true,
      noInfo: true,
      quiet: false,
      inline: true,
      noInfo: true,
      lazy: false,
      public: '',
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  },
);