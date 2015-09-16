/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var a = require('../dist/index');

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

