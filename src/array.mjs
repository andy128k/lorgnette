import { just, nothing } from "./maybe.mjs";
import { Lens } from "./lens.mjs";

export class ArrayPredicateLens extends Lens {
  constructor(predicate, forward = true) {
    super();
    this.predicate = predicate;
    this.forward = forward;
  }

  *#iterate(obj) {
    if (Array.isArray(obj)) {
      if (this.forward) {
        for (let i = 0; i < obj.length; ++i) {
          yield i;
        }
      } else {
        for (let i = obj.length - 1; i >= 0; --i) {
          yield i;
        }
      }
    }
  }

  get(obj) {
    for (const index of this.#iterate(obj)) {
      const element = obj[index];
      if (this.predicate(element, index)) {
        return just(element);
      }
    }
    return nothing;
  }

  update(obj, func) {
    for (const index of this.#iterate(obj)) {
      const element = obj[index];
      if (this.predicate(element, index)) {
        const newElement = func(element);
        if (element !== newElement) {
          const copied = [...obj];
          copied[index] = newElement;
          return copied;
        } else {
          return obj;
        }
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
    if (Array.isArray(obj)) {
      const len = obj.length;
      if (-len <= this.index && this.index < len) {
        const index = (this.index + len) % len;
        return just(obj[index]);
      }
    }
    return nothing;
  }

  update(obj, func) {
    if (this.index === null || !Array.isArray(obj)) {
      return obj;
    }

    const index = this.index < 0 ? this.index + obj.length : this.index;
    const oldVal = obj[index];
    const newVal = func(oldVal);
    if (oldVal !== newVal) {
      const copied = [...obj];
      copied[index] = newVal;
      return copied;
    } else {
      return obj;
    }
  }
}

export class ArrayFirstLens extends ArrayLens {
  constructor() {
    super(0);
  }

  update(obj, func) {
    if (Array.isArray(obj)) {
      return [func(), ...obj];
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
    if (Array.isArray(obj)) {
      return [...obj, func()];
    } else {
      return obj;
    }
  }
}
