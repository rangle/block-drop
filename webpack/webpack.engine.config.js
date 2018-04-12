const path = require('path');
const shared = require('./webpack.shared.config.js');

module.exports = {
  entry: {
    'block-drop-engine': path.join(
      __dirname,
      '..',
      'src',
      'engine',
      'engine.ts',
    ),
  },
  module: shared.module,
  mode: 'production',
  output: {
    chunkFilename: '[id].chunk.js',
    filename: '[name].[hash].js',
    path: path.join(__dirname, '..', 'dist', 'engine'),
    sourceMapFilename: '[name].[hash].js.map',
  },
  plugins: shared.plugins,
  resolve: shared.resolve,
};
