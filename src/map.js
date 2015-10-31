import {just, nothing} from './maybe';
import {Lens} from './lens';


function isScalar(obj) {
  return (/boolean|number|string/).test(typeof obj);
}


export class MapLens extends Lens {
  constructor(key, dflt) {
    super();
    this.key = key;
    this.dflt = dflt;
  }

  get(obj) {
    if (obj && !isScalar(obj) && Object.prototype.hasOwnProperty.call(obj, this.key)) {
      return just(obj[this.key]);
    } else if (this.dflt !== undefined) {
      return just(this.dflt);
    } else {
      return nothing;
    }
  }

  update(obj, func) {
    if (!obj || isScalar(obj)) {
      return obj;
    }
    let oldVal = this.get(obj).getOr();
    let newVal = func(oldVal);
    if (oldVal !== newVal) {
      obj = Object.assign({}, obj);
      obj[this.key] = newVal;
    }
    return obj;
  }
}

