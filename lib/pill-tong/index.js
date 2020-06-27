const fs = require('fs');

const yaml = require('yaml');
const queryStringParser = require('query-string').parse;
const _ = require('lodash');

const httpServerGenerator = require('./http-server-generator');
const proxy = new require('http-proxy').createProxyServer();

// display version
const version = '0.1';

/**
 * secure proxy server
 * 
 * @property {Object} conf configuration
 * @property {Array} filters filter module lists
 * @property {Object} server http proxy server
 */
class PillTong {
  /**
   * @param {Object} options configuration options passed to proxy server
   * @param {String} options.conf pill-tong configuration file src path
   * @param {Boolean} options.noHello disable hello message
   */
  constructor(options) {
    const {
      conf,
      noHello,
    } = _.defaults(options, {
      conf: './pill-tong.yml',
      noHello: false,
    });

    // conf file checker
    if (!PillTong.isFileAvailable(conf, /\.ya?ml/)) {
      throw new Error('configuration file is not found');
    }

    // set conf
    this.conf = yaml.parse(fs.readFileSync(conf).toString());

    // set filters
    this.filters = _.map(this.conf.filters, (filterName) => require(filterName));

    // create proxy server
    this.server = httpServerGenerator(this.conf.ssl)(async (req, res) => {
      // parse GET query string
      const queryString = await new Promise((resolve) => {
        resolve(queryStringParser(req.url.match(/^\/[\?]?(.*)/)[1]));
      });

      // get POST body data
      const body = await new Promise((resolve) => {
        let cs = '';
        req.on('data', (c) => cs += c);
        req.on('end', () => resolve(queryStringParser(cs)));
      });

      // filtering
      const passed = _.every(this.filters, (filter) => filter({ queryString, body }));

      if (passed) {
        proxy.web(req, res, {
          target: {
            host: this.conf.client.host,
            port: this.conf.client.port,
          },
        });
      } else {
        // failed
        res.end('');
      }
    }).listen(this.conf.proxy.port);

    if (!noHello) {
      // say hello
      console.log([
     ' _______  ___   ___      ___      _______  _______  __    _  _______ ',
     '|       ||   | |   |    |   |    |       ||       ||  |  | ||       |',
     '|    _  ||   | |   |    |   |    |_     _||   _   ||   |_| ||    ___|',
     '|   |_| ||   | |   |    |   |      |   |  |  | |  ||       ||   | __ ',
     '|    ___||   | |   |___ |   |___   |   |  |  |_|  ||  _    ||   ||  |',
     '|   |    |   | |       ||       |  |   |  |       || | |   ||   |_| |',
     `|___|    |___| |_______||_______|  |___|  |_______||_|  |__||_______|  v ${version}`,
     ' ',
     '...',
     ' ',
     `ENDPOINT ---> proxy:${this.conf.proxy.port} ---> ${this.conf.client.host}:${this.conf.client.port}`,
    ].join('\n'));
    }
  }

  /**
   * closeing proxy server
   */
  close() {
    this.server.close();
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
