class MultiLens {
  constructor(lenses) {
    this.lenses = lenses;
  }

  get(obj) {
    return this.lenses.map((lens) => lens.get(obj));
  }

  set(obj, ...values) {
    let funcs = values.map((value) => () => value);
    return this.update(obj, ...funcs);
  }

  update(obj, ...funcs) {
    for (let i = 0; i < this.lenses.length; ++i) {
      let lens = this.lenses[i];
      let func = funcs[i] || (a => a);
      obj = lens.update(obj, func);
    }
    return obj;
  }
}

export function multi(...lenses) {
  return new MultiLens(lenses);
}

