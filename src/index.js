import {just, nothing} from './maybe';

function isScalar(obj) {
  return (/boolean|number|string/).test(typeof obj);
}

class Lens {
  get(obj) { // eslint-disable-line no-unused-vars
    return nothing;
  }

  set(obj, value) {
    return this.update(obj, function() { return value; });
  }

  update(obj, func) { // eslint-disable-line no-unused-vars
    return obj;
  }

  compose(lens) {
    return new ComposeLens(this, lens);
  }
}


class ComposeLens extends Lens {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  get(obj) {
    return this.left.get(obj).then(v => this.right.get(v));
  }

  update(obj, func) {
    return this.left.update(obj, v => this.right.update(v, func));
  }
}


class MapLens extends Lens {
  constructor(key) {
    super();
    this.key = key;
  }

  get(obj) {
    if (obj && !isScalar(obj) && Object.prototype.hasOwnProperty.call(obj, this.key))
      return just(obj[this.key]);
    else
      return nothing;
  }

  update(obj, func) {
    if (!obj || isScalar(obj))
      return obj;
    let old_val = this.get(obj).getOr();
    let new_val = func(old_val);
    if (old_val !== new_val) {
      obj = Object.assign({}, obj);
      obj[this.key] = new_val;
    }
    return obj;
  }
}


class MapWithDefaultLens extends MapLens {
  constructor(key, dflt) {
    super(key);
    this.dflt = dflt;
  }

  get(obj) {
    return super.get(obj).recover(() => this.dflt);
  }
}


class ArrayLens extends Lens {
  constructor(index) {
    super();
    this.index = Number.isInteger(index) ? index : null;
  }

  get(obj) {
    if (obj instanceof Array) {
      var len = obj.length;
      if (-len <= this.index && this.index < len) {
        var index = (this.index + len) % len;
        return just(obj[index]);
      }
    }
    return nothing;
  }

  update(obj, func) {
    if (this.index !== null && obj instanceof Array) {
      var index = this.index < 0 ? this.index + obj.length : this.index;
      var old_val = obj[index];
      var new_val = func(old_val);
      if (old_val !== new_val) {
        obj = obj.slice();
        obj[index] = new_val;
      }
    }
    return obj;
  }
}


class ArrayFirstLens extends ArrayLens {
  constructor() {
    super(0);
  }

  update(obj, func) {
    if (obj instanceof Array) {
      return [func()].concat(obj);
    } else {
      return obj;
    }
  }
}


class ArrayLastLens extends ArrayLens {
  constructor() {
    super(-1);
  }

  update(obj, func) {
    if (obj instanceof Array) {
      return obj.concat([func()]);
    } else {
      return obj;
    }
  }
}

export const opaque = new Lens();

export const first = new ArrayFirstLens();

export const last = new ArrayLastLens();

export function at(index) {
  return new ArrayLens(index);
}

export function prop(property, dflt) {
  if (dflt)
    return new MapWithDefaultLens(property, dflt);
  else
    return new MapLens(property);
}

