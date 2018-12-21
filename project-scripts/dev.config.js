/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { name } = require('../package.json');
const { ROOT } = require('./tools');
const { CONFIG, _src, _dist, _mocks } = require('./config-common');

const CLIENT = (...args) => ROOT.apply(null, ['client'].concat(args ? args : []));

const entry = { app: CLIENT('index.js') };
const devServer = {
  open: false,
  progress: true,
  compress: false,
  stats: 'errors-only',
  port: 3000,
  contentBase: [_src, _mocks]
};
const plugins = origin => [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    USE_MOCK_SERVICE: true
  }),
  ...origin,
  new HtmlWebpackPlugin({
    title: name,
    template: CLIENT('index.html'),
    inject: 'body',
    chunks: ['app']
  })
];

const configs = CONFIG({
  mode: 'development',
  entry,
  devtool: "source-map",
  target: 'web',
  devServer,
  plugins
});

// console.log(configs);

module.exports = configs;