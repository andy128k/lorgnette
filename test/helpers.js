var maybe = require('../dist/maybe');

module.exports = function(chai) {
  chai.Assertion.addProperty('nothing', function () {
    this.assert(
      this._obj === maybe.nothing,
      'expected #{this} to be Nothing',
      'expected #{this} to not be Nothing',
      maybe.nothing,
      this._obj
    );
  });

  chai.Assertion.addMethod('just', function(value) {
    this.assert(
      this._obj.constructor.name === 'Just' && this._obj.value === value,
      'expected #{this} to be Just(#{exp})',
      'expected #{this} to not be Just(#{exp})',
      value,
      this._obj.value
    );
  });
};

