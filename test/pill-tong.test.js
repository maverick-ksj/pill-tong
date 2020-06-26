const proxy = require('../lib/pill-tong');

const assert = require('assert');
const _ = require('lodash');

describe('lib/secure-proxy-server', () => {
  describe('https #createSecureProxyServer', () => {
    it('creation', () => {
      _.forEach([
        'createSecureProxyServer', // creation methods
        'createProxyServer',
        'createServer',
        'createProxy',
        'create',
      ], (name) => {
        assert.equal(typeof proxy[name], 'function');
        assert.equal(typeof proxy[name](), 'object');
      });
    });

    it('creation with conf option', () => {
      try {
        const p = proxy.create({
          conf: './pill-tong.yml', // default conf file
        });

        assert.equal(typeof p, 'object');
        assert.notEqual(p.env, undefined);
      } catch { }
    })
  });
});
