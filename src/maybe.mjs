class Just {
  constructor(value) {
    this.value = value;
  }

  isJust() {
    return true;
  }

  isNothing() {
    return false;
  }

  getOr(orElse) {
    return this.value;
  }

  then(func) {
    return func(this.value);
  }

  recover(func) {
    return this;
  }
}

export function just(value) {
  return new Just(value);
}

export const nothing = {
  isJust() {
    return false;
  },

  isNothing() {
    return true;
  },

  getOr(value) {
    return value;
  },

  then(func) {
    return nothing;
  },

  recover(func) {
    return just(func());
  },
};
