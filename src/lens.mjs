export class Lens {
  /* abstract get(obj) */
  /* abstract update(obj, func) */

  set(obj, value) {
    return this.update(obj, () => value);
  }
}

class ComposeLens extends Lens {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  get(obj) {
    return this.left.get(obj).then((v) => this.right.get(v));
  }

  update(obj, func) {
    return this.left.update(obj, (v) => this.right.update(v, func));
  }
}

export function registerChainable(name, implementation) {
  Lens.prototype[name] = function (...args) {
    return new ComposeLens(this, implementation(...args));
  };
}
