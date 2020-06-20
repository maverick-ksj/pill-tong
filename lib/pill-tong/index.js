const fs = require('fs');
const yaml = require('yaml');

/**
 * secure proxy server
 */
class PillTong {
  /**
   * @param {Object} options configuration options passed to proxy server
   * @param {String} options.conf pill-tong configuration file src path
   */
  constructor(options = {
    conf: './pill-tong.yml',
  }) {
    console.log(this.env);
    this.env = yaml.parse(fs.readFileSync('./pill-tong.yml').toString());
  }
}

// export the PillTong Secure Proxy Server module
module.exports = PillTong;
