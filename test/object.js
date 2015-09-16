/*global describe, it*/
var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers'));

var a = require('../dist/index');

describe('object lens', function() {
  var key = a.prop('key');
  var k3 = {key: 3};

  function id(v) {
    return v;
  }

  function next(v) {
    return (v|0) + 1;
  }

  it('gets', function() {
    expect(key.get(null)).to.be.nothing;
    expect(key.get('text')).to.be.nothing;
    expect(key.get({})).to.be.nothing;
    expect(key.get(k3)).to.be.just(3);
  });

  it('sets', function() {
    expect(key.set(null, '!')).to.be.null;
    expect(key.set('text', '!')).to.be.equal('text');

    expect(key.set({}, '!')).to.be.deep.equal({key: '!'});
    expect(key.set(k3, '!')).to.be.deep.equal({key: '!'});
    expect(key.set(k3, 3)).to.be.equal(k3);
  });

  it('updates', function() {
    expect(key.update(null, next)).to.be.null;
    expect(key.update('text', next)).to.be.equal('text');

    expect(key.update({}, next)).to.be.deep.equal({key: 1});
    expect(key.update(k3, next)).to.be.deep.equal({key: 4});
    expect(key.update(k3, id)).to.be.equal(k3);
  });
});

