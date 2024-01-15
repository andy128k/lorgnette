import { just, nothing } from "./maybe.mjs";
import { Lens } from "./lens.mjs";

function isScalar(obj) {
  return /boolean|number|string/.test(typeof obj);
}

export class MapLens extends Lens {
  constructor(key, dflt) {
    super();
    this.key = key;
    this.dflt = dflt;
  }

  get(obj) {
    if (obj && !isScalar(obj) && Object.hasOwn(obj, this.key)) {
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
    const oldVal = this.get(obj).getOr();
    const newVal = func(oldVal);
    if (oldVal !== newVal) {
      return { ...obj, [this.key]: newVal };
    } else {
      return obj;
    }
  }
}
