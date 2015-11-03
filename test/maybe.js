/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var lens = require('../dist/index');
var just = lens.just;
var nothing = lens.nothing;

describe('maybe', function() {
  it('wraps values', function() {
    expect(nothing.isNothing()).to.be.true;
    expect(nothing.isJust()).to.be.false;
    expect(just('value').isNothing()).to.be.false;
    expect(just('value').isJust()).to.be.true;

    expect(nothing).to.be.nothing;
    expect(just('value')).to.be.just('value');
    expect(just(undefined)).to.be.just(undefined);
  });

  it('unpacks', function() {
    expect(nothing.getOr('anotherValue')).to.be.equal('anotherValue');
    expect(just('value').getOr('anotherValue')).to.be.equal('value');
  });

  it('is chainable', function() {
    function appendBang(s) {
      return just(s + '!');
    }

    expect(nothing.then(appendBang)).to.be.nothing;
    expect(just('value').then(appendBang)).to.be.just('value!');
    expect(just('value').then(() => nothing)).to.be.nothing;
  });

  it('recovers', function() {
    expect(nothing.recover(() => 'anotherValue')).to.be.just('anotherValue');
    expect(just('value').recover(() => 'anotherValue')).to.be.just('value');
  });
});

