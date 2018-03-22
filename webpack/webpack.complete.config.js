const path = require('path');
const shared = require('./webpack.shared.config.js');
const plugins = shared.plugins.concat([ shared.pluginIndex('index.html') ]);

module.exports = {
  devtool: 'source-map',
  entry: {
    'block-drop': path.join(__dirname, '..', 'src', 'index.ts'),
  },
  module: shared.module,
  mode: 'production',
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, '..', 'dist', 'block-drop'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins,
  resolve: shared.resolve,
};
