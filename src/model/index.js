/*
 * Created on Wed Dec 05 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

import { RKS, dataParse, deepclone, got, noop, PluginGo, symbolfor } from 'view-node-engine/tools'

const LOCKER  = symbolfor('VIEW-NODE');
const CONTEXT = symbolfor(0x653A82);

export default class Node {
  ____       = LOCKER;
  __parent__ = null

  shouldUpdateFlag = false;

  child = {};

  constructor(data, parent) {
    const raw = this.__$raw__ = deepclone(data);

    this.__$RKS__ = RKS();
    this.__data__ = dataParse(raw);

    // this.parent = parent;
    // this.serve_provider();

    if(parent) {
      this.parent = parent;
      this.serve_provider();
    }

  }

  set parent(value) {
    if(value && value.__$RKS__ === this.__$RKS__)
      throw new Error('ERROR !! Can not set node parent = self!!!');

    if(this.parent === value)
      return

    if(!value)
      return this.registryID2Store(true);

    const prev = this.__parent__, next = value;
    if(prev && next && prev.__$RKS__ === next.__$RKS__)
      return

    this.shouldUpdateFlag = true;
    this.__parent__ = value;

    // console.table({
    //   'owner': `[${this.type}, ${this.__$RKS__}]`,
    //   'scope': `[${this.scope.type}, ${this.scope.__$RKS__}]`
    // })

    this.registryID2Store();
  }

  get parent() {
    return this.__parent__;
  }

  registryID2Store(unregistry = false) {
    const { id, scope } = this;

    if(id && scope.store) {
      if(unregistry) {
        delete scope.child[id]
        // console.log(scope.child, 'delete', id);
        return
      }

      if(scope.child[id]) {
        throw new Error(`NODE ID must be unique！but we got another “${id}” again.`)
      } else {
        scope.child[id] = this;
      }
    }
  }

  get data() {
    return got(this.__data__, {});
  }

  get id() {
    return this.data.id || got(this.attrs, {}).id;
  }

  get type() {
    return this.data.type;
  }

  get attrs() {
    return this.data.attrs;
  }

  get options() {
    return this.data.options;
  }

  get scope() {
    if(this.parent)
      return this.parent.store ? this.parent : this.parent.scope;
    else
      return this
  }

  get context() {
    return this.scope.data.context;
  }

  set context(value) {
    this.scope.data.context = value;
  }

  get children() {
    if(this.__children__ === undefined) {
      const data_children = this.data.children;
      this.__children__ = data_children ? this.createChildren(this.data.children) : null;
    }
    return this.__children__;
  }

  set children(value) {
    this.__children__ = value ? this.createChildren(value) : null;
  }

  addChild(child) {
    if(child === null || child === undefined) return;

    child = Array.isArray(child) ? child : [child];
    this.children = this.__children__ ? this.__children__.concat(child) : child;

    this.shouldUpdateFlag = true;

    this.plugin(NODE_PLUGIN.ADD_CHILD).use(this);
    this.plugin(NODE_PLUGIN.UPDATE_DISPLAY_LIST).use(this);
  }

  removeChild(child) {
    const children = this.__children__;
    if(Array.isArray(children)) {
      child = Array.isArray(child) ? child : [child];

      while(child.length) {
        const t = child.pop();
        children.some((c, i) => c === t ? (children.splice(i, 1), true) : false);
      }

      this.shouldUpdateFlag = true;

      this.plugin(NODE_PLUGIN.REMOVE_CHILD).use(this);
      this.plugin(NODE_PLUGIN.UPDATE_DISPLAY_LIST).use(this);
    }
  }

  get executes() {
    return got(this.data.executes);
  }

  set executes(value) {
    this.data.executes = value;
  }

  createChildren(children) {
    if(!Array.isArray(children))
      throw new Error(`The argument of Node's "createChildren" method must be "Array" Type! but we got '${children}'`);

    return children.map(child => isNode(child) ? (child.parent = this, child) : new Node(child, this));
  }

  updateSource = (name, value) => {
    this.shouldUpdateFlag = true;

    if(!this.options)
      this.options = {};

    if(value !== null && value !== undefined)
      this.options[name] = value;
    else
      delete this.options[name];

    const cb = this.__subscriber_callback__

    if(typeof cb === 'function') {
      cb(this.options, name, value);
    }

    // TODO: boardcast NODE-CHANGE-EVENT
    this.plugin(NODE_PLUGIN.UPDATE_SOURCE).use(this.options, name, value);
  }

  get update() {
    return this.updateSource;
  }

  set options(value) {
    this.data.options = value;
  }

  get = name => {
    return name && this.options ? this.options[name] : null;
  }

  next = callback => {
    this.__subscriber_callback__ = callback;
  }

  exit = callback => {
    this.__subscriber_callback__ = null;
  }

  set tapable(value) {
    this.__tapable__ = value;
  }

  get tapable() {
    return (this.__tapable__ || noop)(this);
  }

  get adapter() {
    return this[0xAC00213];
  }

  dispatchEvent(event) {
    if(event.__$stopped$__)
      return;

    if(!event.target)
      event.target = this;

    if(event.target === this && this.executes) {
      this.plugin(NODE_PLUGIN.EXECUTION).use(this, event.type);
    }

    const store = this.scope.store;
    if(store) {
      return store.dispatchEvent(event);
    }

    const parent = this.parent;
    if(parent) {
      parent.dispatchEvent(event);
    }
  }

  get store() {
    return this.__store__;
  }

  set store(value) {
    if(!value)
      return this.__store__ = null;

    this.__store__    = (value.node = this, value.createMapping(), value);
    this.__provider__ = value.provider;
  }

  serve_provider() {
    const serve = got(this.provider, {}).serve || noop;
    serve(this);
  }

  get provider () {
    return this.store_context ? this.store_context.store.provider : got(this.__provider__, {});
  }

  get store_context() {
    if(this.parent) {
      return this.parent.store ? this.parent : this.parent.store_context;
    } else {
      return null;
    }
  }

  get ids() {
    return this.child;
  }

  get global() {
    if(this.parent) {
      return this.parent.global;
    } else {
      return this;
    }
  }

  plugin(name, callback) {
    if(!this.__plugin_go__) {
      this.__plugin_go__ = new PluginGo();
    }

    const pg = this.__plugin_go__;

    if(callback === undefined) {
      // if this function only has one argument, it will trigger plugin who name is input-name
      return pg.load(name);
    } else {
      // register plugin
      pg.plug(name, callback);
    }
  }

  serialized() {
    const persist  = [
      'id',
      'type',
      'executes',
      'attrs',
      'options',
      'children'
    ].reduce((acc, field) => {
      const data = this[field];
      if(data) {
        acc[field] = field !== 'children'
                  ? data
                  : this.children.map(child => child.serialized());
      }
      return acc;
    }, {});

    return persist;
  }

  dispose() {
    this.parent = null;
    this.store  = null;

    // console && console.warn(`[DISPOSED] ${this.__$RKS__}\t${this.type}`);
  }
}

export const NODE_PLUGIN = {
  TAP_NODE: '-tap-node-:plugin-',

  SET_CONTEXT: '-set-context-:plugin-',

  FORCE_GET: '-force-get-:plugin-',
  EXECUTION: '-execution-:plugin-',
  RESPONSED: '-responsed-:plugin-',
  SET_MODEL: '-set-model-:plugin-',

  ADD_CHILD: '-add-child-:plugin-',
  REMOVE_CHILD: '-remove-child-:plugin-',
  UPDATE_DISPLAY_LIST: '-update-display-list-:plugin-',

  UPDATE_SOURCE: '-update-source-:plugin-'
};

export function isNode(value) {
  return value.____ === LOCKER;
}
