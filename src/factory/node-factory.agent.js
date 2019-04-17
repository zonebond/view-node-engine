/*
 * Created on Tue Dec 04 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

import NODE_TYPEADAPTER from './node-type.adapter'
import { normalizedType } from 'view-node-engine/tools'

const name   = 0xCF31D2;
const locker = typeof Symbol === 'function' && Symbol['for'] && Symbol['for'](name) || name;

let NFA, factories = {};

class NodeFactoryAgent {

  constructor(key) {
    if(locker !== key) {
      throw new Error('You should not new the Class "NodeFactory"!');
    }
  }

  static RegisterNodeFactory(type, Factory) {
    factories[type] = Factory;
  }

  static NodeAdapter(type) {
    if(!type)
      throw new Error(`You must input a type!`);

    const adapter = factories[type];
    if(!adapter)
      throw new Error(`There is no registered "${type}" corresponding "NodeFactory!"`);

    return adapter;
  }

  static NodeType(node) {
    const type = node.type;

    if(!type)
      throw new Error(`There has no correct "Type" with the node!`);

    const adapter = NFA.NodeAdapter(type);

    node[0xAC00213] = adapter;

    return node;
  }

  static DefineType(name) {
    return function(configs, view) {
      name = normalizedType(name || view.name);
      const factory = NODE_TYPEADAPTER(view, configs);

      NFA.RegisterNodeFactory(name, factory);
    }
  }
}

NFA = NodeFactoryAgent;
NFA.types = factories;

export default NFA
