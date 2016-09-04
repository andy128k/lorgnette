import {just, nothing} from './maybe';
import {Lens} from './lens';


export class ArrayPredicateLens extends Lens {
  constructor(predicate, forward = true) {
    super();
    this.predicate = predicate;
    this.forward = forward;
  }

  *iterate(obj) {
    if (obj instanceof Array) {
      if (this.forward) {
        for (let i = 0; i < obj.length; ++i) {
          yield [obj[i], i];
        }
      } else {
        for (let i = obj.length - 1; i >= 0; --i) {
          yield [obj[i], i];
        }
      }
    }
  }

  get(obj) {
    for (let [element, index] of this.iterate(obj)) {
      if (this.predicate(element, index)) {
        return just(element);
      }
    }
    return nothing;
  }

  update(obj, func) {
    for (let [element, index] of this.iterate(obj)) {
      if (this.predicate(element, index)) {
        const newElement = func(element);
        if (element !== newElement) {
          obj = obj.slice();
          obj[index] = newElement;
        }
        return obj;
      }
    }
    return obj;
  }
}


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
      var oldVal = obj[index];
      var newVal = func(oldVal);
      if (oldVal !== newVal) {
        obj = obj.slice();
        obj[index] = newVal;
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

