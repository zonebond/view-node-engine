/*
 * Created on Wed Dec 05 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

import { RKS, dataParse, got, noop } from 'view-node-engine/tools'

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
    return this.data.id || this.attrs.id;
  }

  get type() {
    return this.data.type;
  }

  get attrs() {
    return got(this.data.attrs, {});
  }

  get options() {
    return got(this.data.options);
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

  dispatchEvent(event) {
    if(event.__$stopped$__)
      return;

    if(!event.target)
      event.target = this;

    const target = this.store && event.target !== this ? this.store : this.parent;

    if(target) {
      target === this.store ? target._dispatchEvent_(event) : target.dispatchEvent(event);
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
    const serve = this.provider.serve || noop;
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
    return this.context ? this.context.store.provider : got(this.__provider__, {});
  }

  get context() {
    if(this.parent) {
      return this.parent.store ? this.parent : this.parent.context;
    } else {
      return null;
    }
  }

  get ids() {
    return this.child;
  }
}
