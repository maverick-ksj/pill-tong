// ignore invalid self-signed ssl cert
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const proxy = require('../lib/pill-tong');

const assert = require('assert');
const _ = require('lodash');
const rp = require('request-promise');

const genHttpProxy = () => proxy.create({
  conf: './test/http-conf.yml',
  noHello: true,
});

const genHttpsProxy = () => proxy.create({
  conf: './test/https-conf.yml',
  noHello: true,
});

describe('lib/pill-tong', () => {
  describe('# http', () => {
    it('creation', () => {
      const p = genHttpProxy();

      assert.equal(typeof p.conf, 'object');
      assert.equal(p.filters instanceof Array, true);

      p.close();
    });

    it('xss filter check', async () => {
      const p = genHttpProxy();

      const resp = await rp(`http://127.0.0.1:${p.conf.proxy.port}?<script>`);
      assert.equal(resp, '');

      p.close();
    });
  });

  describe('# https', () => {
    it('creation', () => {
      const p = genHttpsProxy();

      assert.equal(typeof p.conf, 'object');
      assert.equal(p.filters instanceof Array, true);

      p.close();
    });

    it('xss filter check', async () => {
      const p = genHttpsProxy();

      const resp = await rp(`https://127.0.0.1:${p.conf.proxy.port}?<script>`);
      assert.equal(resp, '');

      p.close();
    })
  });
});
