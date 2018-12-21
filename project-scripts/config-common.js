/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const { ROOT, SRC } = require('./tools');

const [_root, _src, _index, _dist] = [ROOT(), SRC(), SRC('index.js'), ROOT('dist')];

const rules = [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: /node_modules/
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.less$/,
    use: ['style-loader', { loader: 'css-loader', options: { sourceMap: false } }, 'less-loader']
  },
  {
    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    use: [{ loader: 'url-loader', options: { limit: 10000 } }]
  }
];

// WEBPACK COMMONS CONFIGURATIONS
const commons = {
  entry: _index,
  output: {
    path: _dist,
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [_src, 'node_modules'],
    extensions: ['*', '.js', '.json']
  },
  module: {
    rules
  },
  plugins: [],
  stats: {
    colors: true,
    entrypoints: true
  }
};


module.exports = {
  CONFIG: (options) => options ? Object.keys(options).reduce((commons, name) => {
    debugger;
    const common = commons[name];
    const custom = options[name];

    if(typeof custom === 'function') {
      commons[name] = custom(common);
      return commons;
    }

    if(custom) {
      commons[name] = custom;
      return commons;
    }

    return commons;
  }, commons) : commons,
  _root, _src, _index, _dist
};
