/*
 * Created on Fri Dec 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { symbolfor, got, noop } from 'view-node-engine/tools'

const OWNER = symbolfor(0x55ADD1);

class Serve {
  nodes = [];

  constructor(callback, hash) {
    this.hash = hash;
    this.__callback__ = callback;
  }

  get callback() {
    return got(this.__callback__, noop);
  }

  join(value){
    this.nodes.push(value);
  }
}

export default class Provider {

  serves = {};

  constructor() {
    return { provider: this, serve: this.__node_delegate__ };
  }

  __node_delegate__ = (serve, callback) => {
    const { id, type } = typeof serve === 'string' ? { id: serve } : serve;
    const hash = id ? `${id},` : `,${type}`;
    this.serves[hash] = new Serve(callback, hash);
  }

  serve = node => {
    const { id, type } = node;

    const serves = this.serves;

    const serve = serves[`${id},`] || serves[`,${type}`];

    if(!serve) {
      return;
    }

    serve.callback(node, this.model, serve.hash[0] === ',' ? serve.nodes.length : undefined );
    serve.join(node);
  }

  set owner(value) {
    this[OWNER] = value;
  }

  get owner() {
    return this[OWNER];
  }

  get model() {
    return this.owner ? this.owner.model : undefined;
  }

}
