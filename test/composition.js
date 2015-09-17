/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens = require('../dist/index');

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
    var counts = [['a', 'b', 1], ['a', 'c', 2], ['b', 'b', 3]].reduce(function (agg, source) {
      return lens.prop(source[0], {}).prop(source[1]).set(agg, source[2]);
    }, {c: 4});

    expect(counts).to.deep.equal({
      a: {b: 1, c: 2},
      b: {b: 3},
      c: 4
    });
  });
});

