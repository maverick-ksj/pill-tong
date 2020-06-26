const fs = require('fs');

const yaml = require('yaml');
const _ = require('lodash');

/**
 * secure proxy server
 */
class PillTong {
  /**
   * @param {Object} options configuration options passed to proxy server
   * @param {String} options.conf pill-tong configuration file src path
   */
  constructor(options) {
    const {
      conf,
    } = _.defaults(options, {
      conf: './pill-tong.yml',
    });

    if (!PillTong.isFileAvailable(conf, /\.ya?ml/)) {
      throw new Error('configuration file is not found');
    }

    this.env = yaml.parse(fs.readFileSync('./pill-tong.yml').toString());
  }

  /**
   * file checker
   * 
   * @param {String} src file source link
   * @param {RegExp} whiteRegex regular expression
   * 
   * @return {Boolean} true: file is available
   */
  static isFileAvailable(src, whiteRegex) {
    if (!fs.existsSync(src)) {
      return false;
    }

    if (
      whiteRegex !== undefined &&
      !src.match(whiteRegex)
    ) {
      return false;
    }

    return true;
  }
}

// export the PillTong Secure Proxy Server module
module.exports = PillTong;
