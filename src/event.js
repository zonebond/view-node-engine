/*
 * Created on Thu Dec 20 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { got, noop } from 'view-node-engine/tools'

export default class Event {
  target;

  constructor(type) {
    if(!type) {
      throw new Error(`Event Type must be an available value. but got ${type}!`);
    }
    this.type = type;
  }

  stopPropagation() {
    this.__$stopped$__ = true;
  }

  __handled__() {
    typeof this.handled === 'function' && this.handled();
  }
}

export function handle(...types) {

  const decorator = (target, name, descriptor) => {

    if(!target.__init__) {
      target.__init__ = [];
    }

    target.__init__.push([name, ...types]);
  }

  return decorator;
}

export class Listener {

  get node() {
    return this.__node__;
  }

  set node(value) {
    if(this.provider) {
      this.provider.owner = value;
    }
    this.__node__ = value;
  }

  createMapping() {
    const listeners = this.__init__;
    if(!Array.isArray(listeners)) return;

    const mapping = {};

    listeners.forEach(([handle, ...types]) => {
      types.forEach(type => {
        if(!mapping[type]) {
          mapping[type] = [];
        }
        mapping[type].push(handle);
      });
    });

    this.__dispatchEvent__ = (evt) => {
      const handles = mapping[evt.type];
      if(Array.isArray(handles)) {
        handles.forEach(handle => {
          this[handle](evt);
          evt.__handled__();
        });
      }
    }
  }

  get _dispatchEvent_() {
    return got(this.__dispatchEvent__, noop);
  }

  dispatchEvent = evt => {
    if(this.node) {
      this.node.dispatchEvent(evt);
    }
  }

}
