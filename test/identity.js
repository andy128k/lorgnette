/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var a = require('../dist/index');

describe('identity lens', function () {
  it('gives object back', function() {
    var o = ['a', 'b', 'c'];
    expect(a.identity.get(o)).to.be.just(o);
  });

  it('does not set values', function() {
    var o = ['a', 'b', 'c'];
    expect(a.identity.set(o, '!')).to.be.equal('!');
  });
});

