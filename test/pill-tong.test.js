const proxy = require('../lib/pill-tong');

const assert = require('assert');
const _ = require('lodash');

describe('lib/secure-proxy-server', () => {
    describe('https #createSecureProxyServer', () => {
        it('creation', () => {
            _.forEach([
                'createSecureProxyServer',
                'createProxyServer',
                'createServer',
                'createProxy',
                'create',
            ], (name) => {
                assert.equal(typeof proxy[name], 'function');
                assert.equal(typeof proxy[name](), 'object');
            });
        });
    });
});
