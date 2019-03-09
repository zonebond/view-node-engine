/*
 * Created on Thu Dec 20 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { symbolfor, got, noop } from 'view-node-engine/tools'

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

const MAPPING = symbolfor(0x55ADD1);

export class Listener {

  constructor() {
    this[MAPPING] = {};
  }

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
    const listeners = got(this.__init__, []);

    const mapping = this[MAPPING];

    listeners.forEach(([handle, ...types]) => {
      types.forEach(type => {
        if(!mapping[type]) {
          mapping[type] = [];
        }
        mapping[type].push(handle);
      });
    });

    this.__dispatchEvent__ = (evt) => {
      const type    = evt.type;
      const handles = mapping[type]
      if(Array.isArray(handles)) {
        handles.forEach(handle => {
          if(typeof(handle) !== 'string') {
            handle(evt);
          } else {
            this[handle](evt);
          }
          evt.__handled__();
        });
      }
    }
  }

  dispatchEvent = evt => {
    this.__dispatchEvent__(evt);
  }

  plugHandle(type, handle) {
    let handles = this[MAPPING][type];

    if(!handles) {
      this[MAPPING][type] = handles = [];
    }

    handles.push(handle);
  }

}
