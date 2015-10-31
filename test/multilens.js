/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens_module = require('../dist/index');
var lens = lens_module.lens, multi = lens_module.multi;

var maybe = require('../dist/maybe');
var just = maybe.just, nothing = maybe.nothing;

describe('multi lens', function() {
  function next(v) {
    return (v|0) + 1;
  }

  describe('map', function() {
    var key = multi(lens.prop('key'), lens.prop('key2'));
    var obj = {key: 3, key2: 2};

    it('gets', function() {
      expect(key.get(null)).to.be.deep.equal([nothing, nothing]);
      expect(key.get('text')).to.be.deep.equal([nothing, nothing]);
      expect(key.get({})).to.be.deep.equal([nothing, nothing]);
      expect(key.get(obj)).to.be.deep.equal([just(3), just(2)]);
      expect(key.get({key2: 7})).to.be.deep.equal([nothing, just(7)]);
    });

    it('sets', function() {
      expect(key.set(null, '!', '?')).to.be.null;
      expect(key.set('text', '!', '?')).to.be.equal('text');

      expect(key.set({}, '!', '?')).to.be.deep.equal({key: '!', key2: '?'});
      expect(key.set(obj, '!', '?')).to.be.deep.equal({key: '!', key2: '?'});
      expect(key.set(obj, 3, 2)).to.be.equal(obj);

      expect(key.set(obj, '!')).to.be.deep.equal({key: '!', key2: 2});
    });

    it('updates', function() {
      expect(key.update(obj, next, next)).to.be.deep.equal({key: 4, key2: 3});
      expect(key.update(obj, next)).to.be.deep.equal({key: 4, key2: 2});
    });
  });

  describe('array', function() {
    var key = multi(lens.first(), lens.last());

    it('gets', function() {
      expect(key.get(null)).to.be.deep.equal([nothing, nothing]);
      expect(key.get('text')).to.be.deep.equal([nothing, nothing]);
      expect(key.get([])).to.be.deep.equal([nothing, nothing]);
      expect(key.get([1, 2, 3, 4])).to.be.deep.equal([just(1), just(4)]);
    });

    it('sets', function() {
      expect(key.set(null, '!', '?')).to.be.null;
      expect(key.set('text', '!', '?')).to.be.equal('text');
      expect(key.set({}, '!', '?')).to.be.deep.equal({});
      expect(key.set([1, 2, 3, 4], '!', '?')).to.be.deep.equal(['!', 1, 2, 3, 4, '?']);
    });
  });

  describe('combined', function() {
    var appender = lens.prop('ingredients', []).last();
    var counter = lens.prop('ingredientsCount');
    var combined = multi(appender, counter);

    it('updates tree', function() {
      var before = {name: 'salad', ingredientsCount: 0};

      var step1 = combined.update(before, () => ({ name: 'mayo', amount: 'a lot' }), next);

      expect(step1).to.be.deep.equal({
        name: 'salad',
        ingredientsCount: 1,
        ingredients: [
          { name: 'mayo', amount: 'a lot' }
        ]
      });

      var step2 = combined.update(step1, () => ({ name: 'potato', amount: 'four' }), next);

      expect(step2).to.be.deep.equal({
        name: 'salad',
        ingredientsCount: 2,
        ingredients: [
          { name: 'mayo', amount: 'a lot' },
          { name: 'potato', amount: 'four' }
        ]
      });
    });
  });
});

