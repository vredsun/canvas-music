import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const BUILD_TIME = new Date().toLocaleString();

const isDevelopment = process.env.NODE_ENV !== 'production';

const DIR_ROOT = path.join(__dirname);
const DIR_APP_SRC = path.join(DIR_ROOT, 'src');
const DIR_APP_DIST = path.join(DIR_ROOT, 'dist');

const pkg = require(path.join(DIR_ROOT, 'package.json'));

const PATH_TO_INDEX_FILE = path.join(DIR_APP_SRC, 'index.tsx');

let BUILD = {
  output: {
    path: DIR_APP_DIST,
    publicPath: '/'
  },
  htmlTemplateName: path.join(DIR_APP_SRC, 'html', 'index.hbs'),
};

const getPlugins = () => {
  const plugins = [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: BUILD.htmlTemplateName,
      publicPath: '/',
      hash: true,
      title: 'Мониторинг чистоты города',
      meta: {
        'mobile-web-app-capable': 'yes',
        'viewport': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui',
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__DEV__': isDevelopment,
      '_VERSION_': JSON.stringify(pkg.version),
      '_RELEASE_DATE_': JSON.stringify(pkg.releaseDate),
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
      '_BUILD_TIME_': JSON.stringify(BUILD_TIME),
    }),
  ];

  if (isDevelopment) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    // some only prod
  }

  if (false) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      }),
    );
  }

  return plugins;
};

const config: webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  // mode: 'development',
  node: {
    fs: 'empty',
    __filename: true,
    __dirname: true
  },
  devtool: isDevelopment ? 'eval' : false,
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    'react-hot-loader/patch',
    'whatwg-fetch',
    PATH_TO_INDEX_FILE,
  ],
  output: {
    path: BUILD.output.path,
    publicPath: BUILD.output.publicPath,
    filename: isDevelopment ? '[name].bundle.js' : 'app.[name].[contenthash].js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    port: 3000,
    hot: true,
    noInfo: true,
    quiet: false,
    inline: true,
    lazy: false,
    public: '',
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      'react-dom': isDevelopment ? '@hot-loader/react-dom' : 'react-dom',
    },
    extensions: [
      '.json',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
  },
  optimization: {
    noEmitOnErrors: true,
    usedExports: true,
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
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: 'file-loader',
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
  plugins: getPlugins(),
};
module.exports = config;
