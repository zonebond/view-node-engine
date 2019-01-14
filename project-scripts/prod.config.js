/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
const fse = require('fs-extra');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { name } = require('../package.json');
const { ROOT, SRC } = require('./tools');
const { CONFIG, _src } = require('./config-common');

const plugins = origin => [
  // new BundleAnalyzerPlugin({ openAnalyzer: false }),
  new CopyWebpackPlugin([{ from: ROOT('manifest.json'), to: ROOT('dist', 'package.json') }]),
  ...origin
];

const configs = CONFIG({
  entry: {
    factory: SRC('factory', 'index.js'),
    model: SRC('model', 'index.js'),
    event: SRC('event.js'),
    index: SRC('index.js'),
    provider: SRC('provider.js'),
    tools: SRC('tools.js')
  },
  mode: 'production',
  devtool: "source-map",
  plugins,
  externals: ['view-node-engine', 'view-node-engine/tools']
});

// console.log(configs);

module.exports = configs;
