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
    filename: 'block-drop.min.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins,
  resolve: shared.resolve,
  devServer: {
    inline: true,
    colors: true,
  },
  loaders: shared.loaders,
};
