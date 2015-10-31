import {just, nothing} from './maybe';
import {Lens} from './lens';


export class ArrayLens extends Lens {
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


export class ArrayFirstLens extends ArrayLens {
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


export class ArrayLastLens extends ArrayLens {
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

