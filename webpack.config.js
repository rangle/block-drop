const path = require('path');
const shared = require('./webpack/webpack.shared.config.js');
const plugins = shared.plugins.concat([shared.pluginIndex('index.html')]);

const { isProd } = shared;

module.exports = {
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    'block-drop': './src/index.ts',
  },
  mode: isProd ? 'production' : 'development',
  module: shared.module,
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist', 'block-drop'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins,
  resolve: shared.resolve,
};
