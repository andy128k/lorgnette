/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens = require('../src/index').lens;

describe('composition', function() {
  function x3(n) {
    return n * 3;
  }

  it('gets', function() {
    expect(lens.prop('a').prop('b').get({})).to.be.nothing;
  });

  it('sets nested arrays', function() {
    var o = [[1, 2], [3, 4, 5], [6, 7]];
    var i1j2 = lens.at(1).at(2);

    expect(i1j2.get(o)).to.be.just(5);
    expect(i1j2.set(o, '!')).to.deep.equal([[1, 2], [3, 4, '!'], [6, 7]]);
    expect(i1j2.update(o, x3)).to.deep.equal([[1, 2], [3, 4, 15], [6, 7]]);
  });

  it('sets deeply', function() {
    var o = [{n: 1}, {n: 2}, {n: 3}];

    expect(lens.at(1).set(o, '!')).to.deep.equal([{n: 1}, '!', {n: 3}]);
    expect(lens.at(1).prop('n').set(o, '!')).to.deep.equal([{n: 1}, {n: '!'}, {n: 3}]);
    expect(lens.at(1).prop('n').prop('m').set(o, '!')).to.deep.equal([{n: 1}, {n: 2}, {n: 3}]);

    expect(lens.prop('a', {}).prop('b').set({}, 'c')).to.deep.equal({a: {b: 'c'}});
  });

  it('updates counters', function() {
    var counts = [['a', 'b', 1], ['a', 'c', 2], ['b', 'b', 3]].reduce(function(agg, source) {
      return lens.prop(source[0], {}).prop(source[1]).set(agg, source[2]);
    }, {c: 4});

    expect(counts).to.deep.equal({
      a: {b: 1, c: 2},
      b: {b: 3},
      c: 4
    });
  });

  describe('recipe', function() {
    var appender = lens.prop('ingredients', []).last();

    it('pushes deeply', function() {
      expect(appender.set({}, { name: 'onion', amount: 0.5 })).to.be.deep.equal({
        ingredients: [
          { name: 'onion', amount: 0.5 }
        ]
      });

      expect(appender.set({name: 'salad'}, { name: 'mayo', amount: 'a lot' })).to.be.deep.equal({
        name: 'salad',
        ingredients: [
          { name: 'mayo', amount: 'a lot' }
        ]
      });
    });
  });

  describe('recipe with predicates', function() {
    const categories = [
      {
        id: 1,
        name: 'first',
        subcategories: [
          {
            id: 1,
            name: 'first in first'
          },
          {
            id: 2,
            name: 'second in first'
          }
        ]
      },
      {
        id: 2,
        name: 'second',
        subcategories: [
          {
            id: 1,
            name: 'first in second'
          },
          {
            id: 2,
            name: 'second in second'
          }
        ]
      }
    ];

    it('pushes deeply', function() {
      const itemAppender = lens.firstOf(c => c.id === 2).prop('subcategories').firstOf(s => s.id === 1).prop('items', []).last();

      expect(itemAppender.set(categories, 'new item')).to.be.deep.equal(
        [
          {
            id: 1,
            name: 'first',
            subcategories: [
              {
                id: 1,
                name: 'first in first'
              },
              {
                id: 2,
                name: 'second in first'
              }
            ]
          },
          {
            id: 2,
            name: 'second',
            subcategories: [
              {
                id: 1,
                name: 'first in second',
                items: ['new item']
              },
              {
                id: 2,
                name: 'second in second'
              }
            ]
          }
        ]
      );
    });
  });
});

