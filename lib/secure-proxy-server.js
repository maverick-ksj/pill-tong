// import secure proxy server module
const SecureProxyServer = require('./secure-proxy-server/index.js');

/**
 * create the secure proxy server
 * 
 * @param {Object} options configuration options passed to proxy server
 * @param {Array} options.plugins linked plugins to proxy server
 * @param {Object} options.custom custom environments values for plugin modules
 * 
 * @return {Object} proxy object for 'web' request
 */
function createSecureProxyServer(options) {
    return new SecureProxyServer(options);
}

// constructor alias
SecureProxyServer.createSecureProxyServer = createSecureProxyServer;
SecureProxyServer.createProxyServer = createSecureProxyServer;
SecureProxyServer.createServer = createSecureProxyServer;
SecureProxyServer.createProxy = createSecureProxyServer;

// export the proxy server
module.exports = SecureProxyServer;
