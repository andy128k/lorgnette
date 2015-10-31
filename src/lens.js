export class Lens {
  /* abstract get(obj) */
  /* abstract update(obj, func) */

  set(obj, value) {
    return this.update(obj, function() { return value; });
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

