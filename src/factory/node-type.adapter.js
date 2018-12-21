/*
 * Created on Fri Dec 14 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
import { got } from 'view-node-engine/tools'

class TypeAdapter {
  constructor(view, configs) {
    this._view   = view;
    this._configs = configs;
  }

  get view() {
    return this._view;
  }

  get attrs() {
    return got(this.configs.attrs);
  }

  get configs() {
    return got(this._configs);
  }

  get configurable() {
    return got(this.configs.options)
  }

  get viewonly() {
    return got(this.configs.viewonly, false);
  }

  get usesprite() {
    return got(this.configs.usesprite, true);
  }

  render = node => {
    this.node = node;
    return this;
  }
}

export default function NodeTypeAdapter(view, configs) {
  return new TypeAdapter(view, configs);
}
