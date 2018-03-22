const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

console.log('Webpack building for', process.env.NODE_ENV || 'dev', 'mode');

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
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    __TEST__: JSON.stringify(process.env.TEST || false),
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
  console.log('ADD UGLIFY');
  plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    })
  );
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
    use: loader || 'ts-loader',
    exclude: inTest ? /node_modules/ :
      /(node_modules\/|\.test\.ts$|tests\.\w+\.ts$)/,
  };
}

module.exports = {
  module: {
    rules: [ loaders.ts, loaders.css ],
  },
  pluginIndex,
  plugins,
  resolve,
};
