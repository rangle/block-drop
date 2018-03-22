const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
console.log('Webpack building for', isProd ? 'prod' : 'dev', 'mode');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: [
      "react",
      [
        "es2015",
        {
          "modules": false,
        },
      ],
      "es2016",
    ],
  },
};

const loaders = {
  css: {
    test: /\.css$/,
    use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
  },
  tsTest: loadTs(null, true),
  istanbulInstrumenter: loadTs('istanbul-instrumenter'),
  ts: loadTs(),
};

function pluginIndex(file) {
  return new HtmlWebpackPlugin({
    template: path.join(__dirname, '..', 'src', 'templates', file),
    inject: 'body',
  });
}

const plugins = [
  new webpack.DefinePlugin({
    __DEV__: !isProd,
    __PRODUCTION__: isProd,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new webpack.ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)/,
    './src'
  ),
  new webpack.ContextReplacementPlugin(
    /\@angular(\\|\/)core(\\|\/)esm5/,
    './src'
  ),
];

if (process.env.NODE_ENV === 'production') {
  plugins.unshift(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }));
}

const resolve = {
  extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.tsx', '.jsx'],
  alias: {
    vue: 'vue/dist/vue.js',
  },
};

function loadTs(loader, inTest) {
  return {
    test: /\.tsx?$/,
    use: loader || isProd ? [
      babelLoader,
      {
        loader: 'ts-loader'
      }
    ] : 'ts-loader',
    exclude: inTest ? /node_modules/ :
      /(node_modules\/|\.spec\.ts$|\.test\.ts$|tests\.\w+\.ts$)/,
  };
}

module.exports = {
  module: {
    rules: [ loaders.ts, loaders.css ],
  },
  pluginIndex,
  plugins,
  resolve,
  isProd,
};
