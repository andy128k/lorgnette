import {just, nothing} from './maybe';
import {Lens} from './lens';


function isScalar(obj) {
  return (/boolean|number|string/).test(typeof obj);
}


export class MapLens extends Lens {
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


export class MapWithDefaultLens extends MapLens {
  constructor(key, dflt) {
    super(key);
    this.dflt = dflt;
  }

  get(obj) {
    return super.get(obj).recover(() => this.dflt);
  }
}

