/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens = require('../src/index').lens;

describe('identity lens', function() {
  it('gives object back', function() {
    var o = ['a', 'b', 'c'];
    expect(lens.get(o)).to.be.just(o);
  });

  it('does not set values', function() {
    var o = ['a', 'b', 'c'];
    expect(lens.set(o, '!')).to.be.equal('!');
  });
});

