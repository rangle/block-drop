const path = require('path');
const shared = require('./webpack.shared.config.js');
const plugins = shared.plugins.concat([
  shared.pluginIndex('index.angular.html'),
]);

module.exports = {
  entry: {
    'block-drop-angular': path.join(
      __dirname,
      '..',
      'src',
      'front-end',
      'angular',
      'stand-alone.angular.ts',
    ),
    'service-worker': path.join(
      __dirname,
      '..',
      'src',
      'front-end',
      'service-worker',
    ),
  },
  module: shared.module,
  mode: 'production',
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, '..', 'dist', 'angular'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins,
  resolve: shared.resolve,
};
