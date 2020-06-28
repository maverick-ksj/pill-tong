const fs = require('fs');

/**
 * generate http server using ssl configuration
 * 
 * @param {Object|Boolean} ssl ssl conf
 */
module.exports = (ssl = false) => (listener) =>
  ssl ?
  require('https').createServer({
    key: fs.readFileSync(ssl.key),
    cert: fs.readFileSync(ssl.cert),
  }, listener) :
  require('http').createServer(listener);
