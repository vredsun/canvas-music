const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index',
  },
  mode: 'development',
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
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
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          'handlebars-loader',
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          "thread-loader",
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                ],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
                'babel-plugin-styled-components',
                '@babel/plugin-syntax-dynamic-import',
                'react-hot-loader/babel',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.json',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    modules: [__dirname, 'src', 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH),
      },
    }),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'vredsun',
      template: path.resolve(__dirname, 'templates', 'index.hbs'),
      favicon: path.resolve(__dirname, 'templates', 'images', 'favicon.png'),
      version: JSON.stringify(`${require(path.join(__dirname, '..', 'package.json')).version}`),
      publicPath: '/',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin({
      generate: (seed, files) => files.reduce(
        (manifest, {name, path}) => {
          if (name !== 'images/.DS_Store') {
            return ({
              ...manifest,
              chunks: {
                ...manifest.chunks || {},
                [name]: path,
              },
            });
          }

          return manifest;
        },
        seed,
      ),
      seed: {
        "short_name": "vredsun",
        "name": "vredsun PWA",
        "start_url": "/",
        "background_color": "#dd3344",
        "theme_color": "#dd3344",
        "display": "fullscreen",
        "version": JSON.stringify(`${require(path.join(__dirname, '..', 'package.json')).version}`),
        "icons": [
          {
            "src": "./images/icons/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "./images/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
      },
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'templates', 'images'),
        to: 'images'
      },
    ]),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
};
