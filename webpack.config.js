const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProd = process.env.NODE_ENV === 'production';

const mode = isProd ? 'production' : 'development';
const devtool = isProd ? 'hidden-source-map' : 'cheap-module-source-map';
const allPlugins = [
  new HtmlWebpackPlugin({
    template: 'src/templates/index.html',
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
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
