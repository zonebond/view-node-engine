/*
 * Created on Fri Dec 14 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { got, symbolfor } from 'view-node-engine/tools'

const PRIVATE = symbolfor('priavte');

class TypeAdapter {
  constructor(view, configs) {
    this[PRIVATE] = {
      view,
      configs
    };
  }

  get view() {
    return this[PRIVATE].view;
  }

  get configs() {
    return got(this[PRIVATE].configs, {});
  }

  get attrs() {
    return got(this.configs.attrs);
  }

  get configurable() {
    return got(this.configs.options);
  }

  get viewonly() {
    return got(this.configs.viewonly, false);
  }

  get usesprite() {
    return got(this.configs.usesprite, true);
  }

  get events() {
    return this.configs.events;
  }

  get executors() {
    return this.configs.executors;
  }
}

export default function NODE_TYPEADAPTER(view, configs) {
  return new TypeAdapter(view, configs);
}
