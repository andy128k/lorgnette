/*global describe, it*/
var expect = require('chai').expect;

var a = require('../dist/index');

describe('array lens', function () {
  describe('array at lens', function () {
    it('gets values', function () {
      expect(a.at('key').get([])).to.be.undefined;
      expect(a.at(0).get([])).to.be.undefined;

      expect(a.at(0).get(['a', 'b', 'c'])).to.equal('a');
      expect(a.at(1).get(['a', 'b', 'c'])).to.equal('b');
      expect(a.at(2).get(['a', 'b', 'c'])).to.equal('c');

      expect(a.at(3).get(['a', 'b', 'c'])).to.be.undefined;
      expect(a.at(-1).get(['a', 'b', 'c'])).to.equal('c');
      expect(a.at(-2).get(['a', 'b', 'c'])).to.equal('b');
      expect(a.at(-3).get(['a', 'b', 'c'])).to.equal('a');
      expect(a.at(-4).get(['a', 'b', 'c'])).to.be.undefined;
    });

    it('does not get value from non-array', function() {
      var at1 = a.at(1);
      var ats = a.at('key');

      expect(ats.get(null)).to.be.undefined;
      expect(at1.get('text')).to.be.undefined;
      expect(at1.get(33.1)).to.be.undefined;
      expect(ats.get({})).to.be.undefined;
      expect(ats.get({key: 3})).to.be.undefined;
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
      expect(lens.get('test')).to.be.undefined;
    });

    it('gets value', function () {
      expect(lens.get([])).to.be.undefined;
      expect(lens.get(['a', 'b', 'c'])).to.equal('a');
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
      expect(lens.get('test')).to.be.undefined;
    });

    it('gets value', function () {
      expect(lens.get([])).to.be.undefined;
      expect(lens.get(['a', 'b', 'c'])).to.equal('c');
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

/*

describe('immutable', function() {
  function id(v) {
    return v;
  }

  function next(v) {
    return (isScalar(v) ? v : 0) + 1 ;
  }

  it('dissocs', function() {
    expect(immutable.dissoc({key: 3}, 'key')).to.equal({});
    expect(immutable.dissoc({key: 3}, 'key2')).to.equal({key: 3});
    expect(immutable.dissoc([], 0)).to.equal([]);
    expect(immutable.dissoc([1, 2, 3], 2)).to.equal([1, 2]);
    expect(immutable.dissoc([1, 2, 3], 3)).to.equal([1, 2, 3]);
    expect(immutable.dissoc([1, 2, 3], -3)).to.equal([2, 3]);
    expect(immutable.dissoc([1, 2, 3], -4)).to.equal([1, 2, 3]);
  });

  it('updates', function() {
    expect(immutable.update(null, 'key', next)).to.be.null;
    expect(immutable.update('text', 1, next)).to.equal('text');

    expect(immutable.update([], 'key', next)).to.equal([]);
    expect(immutable.update([], 0, next)).to.equal([1]);
    expect(immutable.update(['a', 'b', 'c'], 0, next)).to.equal(['a1', 'b', 'c']);
    expect(immutable.update(['a', 'b', 'c'], 0, id)).to.equal(['a', 'b', 'c']);
    expect(immutable.update(['a', 'b', 'c'], -1, next)).to.equal(['a', 'b', 'c1']);

    expect(immutable.update({}, 'key', next)).to.equal({key: 1});
    expect(immutable.update({key: 3}, 'key', next)).to.equal({key: 4});
    expect(immutable.update({key: 3}, 'key', id)).to.equal({key: 3});
  });

  it('assocs deeply', function() {
    expect(immutable.assocIn([{n: 1}, {n: 2}, {n: 3}], [1], '!')).to.equal([{n: 1}, '!', {n: 3}]);
    expect(immutable.assocIn([{n: 1}, {n: 2}, {n: 3}], [1, 'n'], '!')).to.equal([{n: 1}, {n: '!'}, {n: 3}]);
    expect(immutable.assocIn([{n: 1}, {n: 2}, {n: 3}], [1, 'n', 'm'], '!')).to.equal([{n: 1}, {n: 2}, {n: 3}]);

    expect(immutable.assocIn({}, ['a', 'b'], 'c')).to.equal({a: {b: 'c'}});
  });
});

*/

