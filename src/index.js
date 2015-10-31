import {just, nothing} from './maybe';
import {Lens} from './lens';

function isScalar(obj) {
  return (/boolean|number|string/).test(typeof obj);
}


class IdentityLens extends Lens {
  get(obj) {
    return just(obj);
  }

  update(obj, func) {
    return func(obj);
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


Lens.prototype.prop = function(property, dflt) {
  if (dflt)
    return this.compose(new MapWithDefaultLens(property, dflt));
  else
    return this.compose(new MapLens(property));
};


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


Lens.prototype.at = function(index) {
  return this.compose(new ArrayLens(index));
};


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


Lens.prototype.first = function() {
  return this.compose(new ArrayFirstLens());
};


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


Lens.prototype.last = function() {
  return this.compose(new ArrayLastLens());
};


export default new IdentityLens();

