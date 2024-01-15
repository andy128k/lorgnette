class MultiLens {
  constructor(lenses) {
    this.lenses = lenses;
  }

  get(obj) {
    return this.lenses.map((lens) => lens.get(obj));
  }

  set(obj, ...values) {
    const funcs = values.map((value) => () => value);
    return this.update(obj, ...funcs);
  }

  update(obj, ...funcs) {
    let result = obj;
    for (let i = 0; i < this.lenses.length; ++i) {
      const lens = this.lenses[i];
      const func = funcs[i] || ((a) => a);
      result = lens.update(result, func);
    }
    return result;
  }
}

export function multi(...lenses) {
  return new MultiLens(lenses);
}
