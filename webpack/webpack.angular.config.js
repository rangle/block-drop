const path = require('path');
const shared = require('./webpack.shared.config.js');
const plugins = shared.plugins.concat([
  shared.pluginIndex('index.angular.html'),
]);

module.exports = {
  entry: {
    'block-drop-angular': path
      .join(__dirname, '..', 'src', 'front-end', 'angular', 'angular.ts'),
  },
  stats: shared.stats,
  module: shared.module,
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, '..', 'dist', 'angular'),
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
