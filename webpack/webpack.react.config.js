const path = require('path');
const shared = require('./webpack.shared.config.js');
const plugins = shared.plugins.concat([
  shared.pluginIndex('index.react.html'),
]);

module.exports = {
  entry: {
    'block-drop-react': path
      .join(__dirname, '..', 'src', 'front-end', 'react', 'react.tsx'),
  },
  stats: shared.stats,
  module: shared.module,
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, '..', 'dist', 'react'),
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
