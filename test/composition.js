/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var a = require('../dist/index');

describe('composition', function() {
  function x3(n) {
    return n * 3;
  }

  it('sets nested arrays', function() {
    var o = [[1, 2], [3, 4, 5], [6, 7]];
    var lens = a.at(1).at(2);

    expect(lens.get(o)).to.be.just(5);
    expect(lens.set(o, '!')).to.deep.equal([[1, 2], [3, 4, '!'], [6, 7]]);
    expect(lens.update(o, x3)).to.deep.equal([[1, 2], [3, 4, 15], [6, 7]]);
  });

  it('sets deeply', function() {
    var o = [{n: 1}, {n: 2}, {n: 3}];

    expect(a.at(1).set(o, '!')).to.deep.equal([{n: 1}, '!', {n: 3}]);
    expect(a.at(1).prop('n').set(o, '!')).to.deep.equal([{n: 1}, {n: '!'}, {n: 3}]);
    expect(a.at(1).prop('n').prop('m').set(o, '!')).to.deep.equal([{n: 1}, {n: 2}, {n: 3}]);

    expect(a.prop('a', {}).prop('b').set({}, 'c')).to.deep.equal({a: {b: 'c'}});
  });

  it('updates counters', function() {
    var counts = [['a', 'b', 1], ['a', 'c', 2], ['b', 'b', 3]].reduce(function (agg, source) {
      var lens = a.prop(source[0], {}).prop(source[1]);
      return lens.set(agg, source[2]);
    }, {c: 4});

    expect(counts).to.deep.equal({
      a: {b: 1, c: 2},
      b: {b: 3},
      c: 4
    });
  });
});

