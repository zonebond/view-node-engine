/*
 * Created on Thu Dec 20 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

export default class Event {
  target;

  constructor(type) {
    if(!type) {
      throw new Error(`Event Type must be an available value. but got ${type}!`);
    }
    this.type = type;
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

    this.dispatchEvent = (evt) => {
      const handles = mapping[evt.type];
      if(Array.isArray(handles)) {
        handles.forEach(handle => {
          this[handle](evt);
        })
      }
    }
  }

}
