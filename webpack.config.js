const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProd = process.env.NODE_ENV === 'production';
const logLevel = (function() {
  if (process.env.NODE_LOG) {
    return process.env.NODE_LOG;
  }
  return isProd ? 'production' : 'debug';
})();

const mode = isProd ? 'production' : 'development';
const devtool = isProd ? 'hidden-source-map' : 'cheap-module-source-map';
const allPlugins = [
  new HtmlWebpackPlugin({
    template: 'src/templates/index.ejs',
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  new webpack.DefinePlugin({
    LOG_LEVEL: JSON.stringify(logLevel),
  }),
];
const prodPlugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  }),
];

const plugins = isProd ? allPlugins.concat(prodPlugins) : allPlugins;

console.log(`building for ${mode}`);

module.exports = {
  entry: './src/index.ts',
  devtool,
  devServer: {
    contentBase: './dist',
  },
  mode,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.glsl$/,
        use: 'webpack-glsl-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
