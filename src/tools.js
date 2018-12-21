/*
 * Created on Wed Dec 05 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

// xxxXxxxX => xxx-xxxx-x
export function normalizedType(type, join = '-') {
  if (/_|-/.test(type))
  return type.toLowerCase();

  if (!/[a-z]/.test(type))
    return type.toLowerCase();

  let raw = type.split(''),
      index = 0;
  while(index < raw.length) {
    if (/[A-Z]/.test(raw[index])) {
      raw[index] = raw[index].toLowerCase();
      if (index != 0) {
        raw.splice(index, 0, join)
        index++;
      }
    }
    index++;
  }

  return raw.join('');
}

export function noop() { }

export function got(pro, def) {
  return pro !== undefined && pro !== null || def === undefined ? pro : def
}

export function one(inputs, truth, falsity) {
  inputs = Array.isArray(inputs) ? inputs : [inputs];
  return inputs.some(input => input)
       ? typeof(truth) === 'function' ? truth() : truth
       : typeof(falsity) === 'function' ? falsity() : falsity
}

export function and(inputs, truth, falsity) {
  inputs = Array.isArray(inputs) ? inputs : [inputs];
  return inputs.every(input => input)
       ? typeof(truth) === 'function' ? truth() : truth
       : typeof(falsity) === 'function' ? falsity() : falsity
}


RKS.__uuid__ = 0;
export function RKS(value) {
  const float = RKS.__uuid__ < Number.MAX_VALUE ? RKS.__uuid__++ : (RKS.__uuid__ = 0, RKS.__uuid__);
  return 'rks.' + float + (value ? '/' + value : '');
}

export function dataParse(data) {
  if(typeof data === 'string') {
    const [type, value] = data.split(/:/);
    return { type, options: { value } };
  } else if(!data.type) {
    const type  = Object.keys(data).pop();
    const value = data[type];
    return Array.isArray(value) ? { type, children: value } : { type, ...value }
  } else {
    return data;
  }
}

export function REF2(name, provider, target) {
  const field  = target || name;
  const value = provider ? provider[name] : null;
  const result = {};
  return value ? (result[field] = value, result) : null;
}
