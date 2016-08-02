const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const SplitByPathPlugin = require('webpack-split-by-path');

const loaders = {
  tslint: {
    test: /\.tsx?$/,
    loader: 'tslint',
    exclude: /node_modules/,
  },
  css: {
    test: /\.css$/,
    loader: 'style-loader!css?-minimize',
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
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    __STAND_ALONE__: process.env.STAND_ALONE ? true : false,
    __TEST__: JSON.stringify(process.env.TEST || false),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.unshift(
    new SplitByPathPlugin([
      { name: 'vendor', path: [path.join(__dirname, '..', 'node_modules')] },
    ])
  );
  plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    })
  );
  plugins.unshift(new webpack.optimize.DedupePlugin());
}

const stats = {
  colors: true,
  reasons: true,
};

const resolve = {
  extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.tsx', '.jsx'],
};

function loadTs(loader, inTest) {
  return {
    test: /\.tsx?$/,
    loader: loader || 'awesome-typescript-loader',
    exclude: inTest ? /node_modules/ :
      /(node_modules\/|\.test\.ts$|tests\.\w+\.ts$)/,
  };
}

module.exports = {
  loaders,
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint-loader' },
    ],
    loaders: [ loaders.ts, loaders.css ],
  },
  pluginIndex,
  plugins,
  resolve,
  stats,
};
