/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens = require('../dist/index').lens;

describe('array lens', function () {
  describe('array at lens', function () {
    it('gets values', function () {
      expect(lens.at('key').get([])).to.be.nothing;
      expect(lens.at(0).get([])).to.be.nothing;

      expect(lens.at(0).get(['a', 'b', 'c'])).to.be.just('a');
      expect(lens.at(1).get(['a', 'b', 'c'])).to.be.just('b');
      expect(lens.at(2).get(['a', 'b', 'c'])).to.be.just('c');

      expect(lens.at(3).get(['a', 'b', 'c'])).to.be.nothing;
      expect(lens.at(-1).get(['a', 'b', 'c'])).to.be.just('c');
      expect(lens.at(-2).get(['a', 'b', 'c'])).to.be.just('b');
      expect(lens.at(-3).get(['a', 'b', 'c'])).to.be.just('a');
      expect(lens.at(-4).get(['a', 'b', 'c'])).to.be.nothing;
    });

    it('does not get value from non-array', function() {
      var at1 = lens.at(1);
      var ats = lens.at('key');

      expect(ats.get(null)).to.be.nothing;
      expect(at1.get('text')).to.be.nothing;
      expect(at1.get(33.1)).to.be.nothing;
      expect(ats.get({})).to.be.nothing;
      expect(ats.get({key: 3})).to.be.nothing;
    });

    it('sets values', function() {
      expect(lens.at('key').set([], '!')).to.deep.equal([]);
      expect(lens.at(0).set([], '!')).to.deep.equal(['!']);
      expect(lens.at(3).set([1, 2, 3], '!')).to.deep.equal([1, 2, 3, '!']);
      expect(lens.at(0).set(['a', 'b', 'c'], '!')).to.deep.equal(['!', 'b', 'c']);
      expect(lens.at(0).set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'b', 'c']);
      expect(lens.at(-1).set(['a', 'b', 'c'], '!')).to.deep.equal(['a', 'b', '!']);
    });

    it('does not set value for non-array', function() {
      var at1 = lens.at(1);
      var ats = lens.at('key');

      expect(ats.set(null, '!')).to.be.null;
      expect(at1.set('text', '!')).to.equal('text');
      expect(at1.set(33.1, '!')).to.equal(33.1);
      expect(ats.set({}, '!')).to.deep.equal({});
      expect(ats.set({key: 3}, '!')).to.deep.equal({key: 3});
    });
  });

  describe('array.first lens', function() {
    var first = lens.first();

    it('does not get value for non-array', function () {
      expect(first.get('test')).to.be.nothing;
    });

    it('gets value', function () {
      expect(first.get([])).to.be.nothing;
      expect(first.get(['a', 'b', 'c'])).to.be.just('a');
    });

    it('does not push value into non-array', function() {
      expect(first.set(null, '!')).to.be.null;
      expect(first.set('text', '!')).to.equal('text');
      expect(first.set(33.1, '!')).to.equal(33.1);
      expect(first.set({}, '!')).to.deep.equal({});
      expect(first.set({key: 3}, '!')).to.deep.equal({key: 3});
    });

    it('pushes value', function() {
      expect(first.set([], '!')).to.deep.equal(['!']);
      expect(first.set([1, 2, 3], '!')).to.deep.equal(['!', 1, 2, 3]);
      expect(first.set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'a', 'b', 'c']);
    });
  });

  describe('array.last lens', function() {
    var last = lens.last();

    it('does not get value for non-array', function () {
      expect(last.get('test')).to.be.nothing;
    });

    it('gets value', function () {
      expect(last.get([])).to.be.nothing;
      expect(last.get(['a', 'b', 'c'])).to.be.just('c');
    });

    it('does not push value into non-array', function() {
      expect(last.set(null, '!')).to.be.null;
      expect(last.set('text', '!')).to.equal('text');
      expect(last.set(33.1, '!')).to.equal(33.1);
      expect(last.set({}, '!')).to.deep.equal({});
      expect(last.set({key: 3}, '!')).to.deep.equal({key: 3});
    });

    it('pushes value', function() {
      expect(last.set([], '!')).to.deep.equal(['!']);
      expect(last.set([1, 2, 3], '!')).to.deep.equal([1, 2, 3, '!']);
      expect(last.set(['a', 'b', 'c'], 'a')).to.deep.equal(['a', 'b', 'c', 'a']);
    });
  });
});

