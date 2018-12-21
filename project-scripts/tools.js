/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const path = require('path');
const fse  = require('fs-extra');

const ROOT = (...args) => path.resolve.apply(null, [__dirname, '../'].concat(args ? args : []));
const SRC  = (...args) => path.resolve.apply(null, [__dirname, '../', 'src'].concat(args ? args : []));

const _src = SRC();

const getDirectorys = base => fse.readdirSync(base).reduce((acc, name) => {
  const item = path.join(base, name);
  const stat = fse.statSync(item);
  return stat.isDirectory() && acc.push({ name, item }), acc;
}, []);

module.exports = {
  ROOT, SRC
};
