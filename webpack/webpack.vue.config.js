const path = require('path');
const shared = require('./webpack.shared.config.js');
const plugins = shared.plugins.concat([shared.pluginIndex('index.vue.html')]);

module.exports = {
  entry: {
    'block-drop-vue': path.join(
      __dirname,
      '..',
      'src',
      'front-end',
      'vue',
      'stand-alone.vue.ts',
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
    path: path.join(__dirname, '..', 'dist', 'vue'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins,
  resolve: shared.resolve,
};
