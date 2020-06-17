const proxy = require('../lib/secure-proxy-server');

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
            ], (name) => {
                assert.equal(typeof proxy[name], 'function');
                assert.equal(typeof proxy[name](), 'object');
            });
        });
    });
});
