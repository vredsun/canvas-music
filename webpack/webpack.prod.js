const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,
  {
    mode: 'production',
    output: {
      filename: 'app.[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
        },
      },
    },
  },
);