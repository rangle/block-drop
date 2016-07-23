const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

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

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    })
  );
}

module.exports = {
  devtool: 'source-map',
  entry: {
    'block-drop': './src/index.ts',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint-loader' },
    ],
    loaders: [ loaders.ts, loaders.css ],
  },
  output: {
    filename: 'block-drop.min.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins,
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.tsx', '.jsx'],
  },
  devServer: {
    inline: true,
    colors: true,
  },
  loaders,
};

function loadTs(loader, inTest) {
  return {
    test: /\.tsx?$/,
    loader: loader || 'awesome-typescript-loader',
    exclude: inTest ? /node_modules/ :
      /(node_modules\/|\.test\.ts$|tests\.\w+\.ts$)/,
  };
}
