/*
 * Created on Wed Dec 05 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

import { RKS, dataParse, got, noop, PluginGo } from 'view-node-engine/tools'

const name   = 0x31AAD2;
const locker = typeof Symbol === 'function' && Symbol['for'] && Symbol['for'](name) || name;

export default class Node {
  __class_symbol__ = locker;

  child = {};

  constructor(data, parent) {
    this.__$raw__ = data;
    this.__$RKS__ = RKS();
    this.__data__ = dataParse(data);

    this.parent = parent;

    this.serve_provider();
  }

  set parent(value) {
    if(this.__parent__ !== value) {
      this.__parent__ = value;
      value.registryID2Store(this);
    }
  }

  get parent() {
    return this.__parent__;
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

  get context() {
    return this.parent ? this.top.data.context : this.data.context;
  }

  set context(value) {
    if(!this.parent) {
      const next_ctx = this.data.context = value;
    }
    else {
      this.top.context = value;
    }
  }

  get children() {
    if(!this.__children__) {
      this.children = this.createChildren(this.data.children);
    }
    return this.__children__;
  }

  set children(value) {
    this.__children__ = value ? this.createChildren(Array.isArray(value) ? value : [value]) : null;
  }

  addChild(child) {
    if(child === null || child === undefined) return;
    child = Array.isArray(child) ? child : [child];
    this.children = Array.isArray(this.__children__) ? this.__children__.concat(child) : child;
    this.plugin(NODE_PLUGIN.ADD_CHILD).use(this);
    this.plugin(NODE_PLUGIN.UPDATE_DISPLAY_LIST).use(this);
  }

  removeChild(child) {
    const children = this.__children__;
    if(Array.isArray(children) && children.some((c, i) === child ? (children.splice(i, 1), true) : false)) {
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
    return Array.isArray(children) ? children.map(c => (c.__class_symbol__ ? (c.parent = this, c) : new Node(c, this))) : null;
  }

  updateSource = (name, value) => {
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
    // console.log(this.__$raw__.options, this.__data__.options, this.options);
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

    const plugin = this.plugin(NODE_PLUGIN.EXECUTION);
    if(plugin && event.target === this && this.executes) {
      plugin.use(this, event.type);
    }

    if(this.store) {
      this.store.dispatchEvent(event);
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
    this.__store__    = (value.node = this, value.createMapping(), value);
    this.__provider__ = value.provider;
  }

  serve_provider() {
    const serve = got(this.provider, {}).serve || noop;
    // console.log(`[CONTEXT] ${this.type}.context = ${this.context ? this.context.type : undefined}`);
    serve(this);
  }

  registryID2Store(child) {
    const id = child.id;
    if(!id) return;

    if(this.store || !this.parent) {
      if(this.child[id]) {
        throw new Error(`NODE ID must be unique！but we got another “${id}” again.`)
      } else {
        this.child[id] = child;
      }
      // this.child[child.id] = child;
    } else {
      this.parent.registryID2Store(child);
    }
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

  get top() {
    if(this.parent) {
      return this.parent.top;
    } else {
      return this;
    }
  }

  get globalExecutors() {
    return got(this.top.context, {}).executors;
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

    if(!this.parent) {
      persist.context = this.context;
    }

    return persist;
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
  UPDATE_DISPLAY_LIST: '-update-display-list-:plugin-'
};
