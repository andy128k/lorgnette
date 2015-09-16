/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;

var a = require('../dist/index');

chai.use(function(chai) {
  chai.Assertion.addProperty('nothing', function () {
    this.assert(
      this._obj === a.nothing,
      'expected #{this} to be Nothing',
      'expected #{this} to not be Nothing',
      a.nothing,
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
});

describe('array lens', function () {
  describe('array at lens', function () {
    it('gets values', function () {
      expect(a.at('key').get([])).to.be.nothing;
      expect(a.at(0).get([])).to.be.nothing;

      expect(a.at(0).get(['a', 'b', 'c'])).to.be.just('a');
      expect(a.at(1).get(['a', 'b', 'c'])).to.be.just('b');
      expect(a.at(2).get(['a', 'b', 'c'])).to.be.just('c');

      expect(a.at(3).get(['a', 'b', 'c'])).to.be.nothing;
      expect(a.at(-1).get(['a', 'b', 'c'])).to.be.just('c');
      expect(a.at(-2).get(['a', 'b', 'c'])).to.be.just('b');
      expect(a.at(-3).get(['a', 'b', 'c'])).to.be.just('a');
      expect(a.at(-4).get(['a', 'b', 'c'])).to.be.nothing;
    });

    it('does not get value from non-array', function() {
      var at1 = a.at(1);
      var ats = a.at('key');

      expect(ats.get(null)).to.be.nothing;
      expect(at1.get('text')).to.be.nothing;
      expect(at1.get(33.1)).to.be.nothing;
      expect(ats.get({})).to.be.nothing;
      expect(ats.get({key: 3})).to.be.nothing;
    });

    it('sets values', function() {
      expect(a.at('key').set([], '!')).to.deep.equal([]);
      expect(a.at(0).set([], '!')).to.deep.equal(['!']);
      expect(a.at(3).set([1, 2, 3], '!')).to.deep.equal([1, 2, 3, '!']);
      expect(a.at(0).set(['a', 'b', 'c'], '!')).to.deep.equal(['!', 'b', 'c']);
      expect(a.at(0).set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'b', 'c']);
      expect(a.at(-1).set(['a', 'b', 'c'], '!')).to.deep.equal(['a', 'b', '!']);
    });

    it('does not set value for non-array', function() {
      var at1 = a.at(1);
      var ats = a.at('key');

      expect(ats.set(null, '!')).to.be.null;
      expect(at1.set('text', '!')).to.equal('text');
      expect(at1.set(33.1, '!')).to.equal(33.1);
      expect(ats.set({}, '!')).to.deep.equal({});
      expect(ats.set({key: 3}, '!')).to.deep.equal({key: 3});
    });
  });

  describe('array.first lens', function() {
    var lens = a.first;

    it('does not get value for non-array', function () {
      expect(lens.get('test')).to.be.nothing;
    });

    it('gets value', function () {
      expect(lens.get([])).to.be.nothing;
      expect(lens.get(['a', 'b', 'c'])).to.be.just('a');
    });

    it('does not push value into non-array', function() {
      expect(lens.set(null, '!')).to.be.null;
      expect(lens.set('text', '!')).to.equal('text');
      expect(lens.set(33.1, '!')).to.equal(33.1);
      expect(lens.set({}, '!')).to.deep.equal({});
      expect(lens.set({key: 3}, '!')).to.deep.equal({key: 3});
    });

    it('pushes value', function() {
      expect(lens.set([], '!')).to.deep.equal(['!']);
      expect(lens.set([1, 2, 3], '!')).to.deep.equal(['!', 1, 2, 3]);
      expect(lens.set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'a', 'b', 'c']);
    });
  });

  describe('array.last lens', function() {
    var lens = a.last;

    it('does not get value for non-array', function () {
      expect(lens.get('test')).to.be.nothing;
    });

    it('gets value', function () {
      expect(lens.get([])).to.be.nothing;
      expect(lens.get(['a', 'b', 'c'])).to.be.just('c');
    });

    it('does not push value into non-array', function() {
      expect(lens.set(null, '!')).to.be.null;
      expect(lens.set('text', '!')).to.equal('text');
      expect(lens.set(33.1, '!')).to.equal(33.1);
      expect(lens.set({}, '!')).to.deep.equal({});
      expect(lens.set({key: 3}, '!')).to.deep.equal({key: 3});
    });

    it('pushes value', function() {
      expect(lens.set([], '!')).to.deep.equal(['!']);
      expect(lens.set([1, 2, 3], '!')).to.deep.equal([1, 2, 3, '!']);
      expect(lens.set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'b', 'c', 'a']);
    });
  });
});


describe('object lens', function() {
  var key = a.prop('key');
  var k3 = {key: 3};

  function id(v) {
    return v;
  }

  function next(v) {
    return (v|0) + 1;
  }

  it('gets', function() {
    expect(key.get(null)).to.be.nothing;
    expect(key.get('text')).to.be.nothing;
    expect(key.get({})).to.be.nothing;
    expect(key.get(k3)).to.be.just(3);
  });

  it('sets', function() {
    expect(key.set(null, '!')).to.be.null;
    expect(key.set('text', '!')).to.be.equal('text');

    expect(key.set({}, '!')).to.be.deep.equal({key: '!'});
    expect(key.set(k3, '!')).to.be.deep.equal({key: '!'});
    expect(key.set(k3, 3)).to.be.equal(k3);
  });

  it('updates', function() {
    expect(key.update(null, next)).to.be.null;
    expect(key.update('text', next)).to.be.equal('text');

    expect(key.update({}, next)).to.be.deep.equal({key: 1});
    expect(key.update(k3, next)).to.be.deep.equal({key: 4});
    expect(key.update(k3, id)).to.be.equal(k3);
  });
});


describe('composition', function() {
  function x3(n) {
    return n * 3;
  }

  it('sets nested arrays', function() {
    var o = [[1, 2], [3, 4, 5], [6, 7]];
    var lens = a.at(1).compose(a.at(2));

    expect(lens.get(o)).to.be.just(5);
    expect(lens.set(o, '!')).to.deep.equal([[1, 2], [3, 4, '!'], [6, 7]]);
    expect(lens.update(o, x3)).to.deep.equal([[1, 2], [3, 4, 15], [6, 7]]);
  });

  it('sets deeply', function() {
    var o = [{n: 1}, {n: 2}, {n: 3}];

    expect(a.at(1).set(o, '!')).to.deep.equal([{n: 1}, '!', {n: 3}]);
    expect(a.at(1).compose(a.prop('n')).set(o, '!')).to.deep.equal([{n: 1}, {n: '!'}, {n: 3}]);
    expect(a.at(1).compose(a.prop('n')).compose(a.prop('m')).set(o, '!')).to.deep.equal([{n: 1}, {n: 2}, {n: 3}]);

    expect(a.prop('a', {}).compose(a.prop('b')).set({}, 'c')).to.deep.equal({a: {b: 'c'}});
  });

  it('updates counters', function() {
    var counts = [['a', 'b', 1], ['a', 'c', 2], ['b', 'b', 3]].reduce(function (agg, source) {
      var lens = a.prop(source[0], {}).compose(a.prop(source[1]));
      return lens.set(agg, source[2]);
    }, {c: 4});

    expect(counts).to.deep.equal({
      a: {b: 1, c: 2},
      b: {b: 3},
      c: 4
    });
  });
});

