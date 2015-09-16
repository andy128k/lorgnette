class Lens {
  get(obj, dflt) {
    return dflt;
  }

  set(obj, value) {
    return this.update(obj, function() { return value; });
  }

  update(obj/*, func*/) {
    return obj;
  }
}


class ArrayLens extends Lens {
  constructor(index) {
    super();
    this.index = index;
  }

  get(obj, dflt) {
    if (obj instanceof Array) {
      var len = obj.length;
      if (-len <= this.index && this.index < len) {
        var index = (this.index + len) % len;
        return obj[index];
      }
    }
    return dflt;
  }

  update(obj, func) {
    if (obj instanceof Array) {
      var index = this.index < 0 ? this.index + obj.length : this.index;
      var new_obj = obj.slice();
      new_obj[index] = func(new_obj[index]);
      return new_obj;
    } else {
      return obj;
    }
  }
}


class ArrayFirstLens extends Lens {
  get(obj, dflt) {
    if (obj instanceof Array) {
      if (obj.length)
        return obj[0];
    }
    return dflt;
  }

  update(obj, func) {
    if (obj instanceof Array) {
      return [func()].concat(obj);
    } else {
      return obj;
    }
  }
}


class ArrayLastLens extends Lens {
  get(obj, dflt) {
    if (obj instanceof Array) {
      var len = obj.length;
      if (len)
        return obj[len - 1];
    }
    return dflt;
  }

  update(obj, func) {
    if (obj instanceof Array) {
      return obj.concat([func()]);
    } else {
      return obj;
    }
  }
}

export const opaque = new Lens();

export const first = new ArrayFirstLens();

export const last = new ArrayLastLens();

export function at(index) {
  if (typeof index === 'number' && isFinite(index) && Math.floor(index) === index) {
    return new ArrayLens(index);
  } else {
    return opaque;
  }
}

