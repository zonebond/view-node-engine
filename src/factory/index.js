/*
 * Created on Tue Dec 04 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

import NFA from './node-factory.agent'

export default NFA;

export function New(view, label) {
  return label ? { __$label$__: true, label, view } : view;
};