const path = require('path');
const shared = require('./webpack/webpack.shared.config.js');
const plugins = shared.plugins.concat([ shared.pluginIndex('index.html') ]);

module.exports = {
  devtool: 'source-map',
  entry: {
    'block-drop': './src/index.ts',
  },
  stats: shared.stats,
  module: shared.module,
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist', 'block-drop'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins,
  resolve: shared.resolve,
  devServer: {
    inline: true,
    colors: true,
  },
  loaders: shared.loaders,
};
