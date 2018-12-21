/*
 * Created on Wed Dec 05 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { RKS, dataParse, got, noop } from 'view-node-engine/tools'

export default class Node {
  constructor(data, parent) {
    this.__$raw__ = data;
    this.__$RKS__ = RKS();
    this.__data__ = dataParse(data);
    this.__parent__ = parent;
  }

  get parent() {
    return this.__parent__;
  }

  get data() {
    return got(this.__data__, {});
  }

  get id() {
    return this.attrs.id;
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
    this.__children__ = value;
  }

  createChildren(children) {
    return Array.isArray(children) ? children.map(c => new Node(c, this)) : null;
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
    if(!event.target)
      event.target = this;

    const target = this.store || this.parent;

    if(target) {
      target.dispatchEvent(event);
    }

  }

  get store() {
    return this.__store__;
  }

  set store(value) {
    this.__store__ = (value.__node__ = this, value.createMapping(), value);
  }
}
