const fs = require('fs');
const path = require('path');

const yaml = require('yaml');
const queryStringParser = require('query-string').parse;
const _ = require('lodash');
const chalk = require('chalk');

const httpServerGenerator = require('./http-server-generator');
const proxy = new require('http-proxy').createProxyServer();

// display version
const version = '0.9';

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
   * @param {String} options.create create a new pill-tong service
   * @param {String} options.conf pill-tong configuration file src path
   * @param {Boolean} options.noHello disable hello message
   */
  constructor(options) {
    const {
      create,
      conf,
      noHello,
    } = _.defaults(options, {
      create: undefined,
      conf: './pill-tong.yml',
      noHello: false,
    });

    // create a service
    if (create !== undefined) {
      return this.creation();
    }

    // conf file checker
    if (!PillTong.isFileAvailable(conf, /\.ya?ml/)) {
      throw new Error('configuration file is not found');
    }

    // set conf with default values
    this.conf = _.defaultsDeep(yaml.parse(fs.readFileSync(conf).toString()), {
      client: {
        host: 'localhost',
        port: 3000,
      },
      proxy: {
        port: 80,
      },
      filters: [],
      ssl: false,
    });

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
     `ENDPOINT <---> proxy:${this.conf.proxy.port} <---> ${this.conf.client.host}:${this.conf.client.port}`,
    ].join('\n'));
    }
  }

  /**
   * get process current working directory name
   * 
   * @return {String} process cwd
   */
  get cwd() {
    return process.cwd();
  }

  /**
   * get file directory name
   * 
   * @return {String} __dirname
   */
  get dir() {
    return __dirname;
  }

  /**
   * closeing proxy server
   */
  close() {
    this.server.close();
  }

  /**
   * create a pill-tong service
   */
  creation() {
    // check initialized
    if (PillTong.isFileAvailable(path.resolve(this.cwd, 'pill-tong.yml'))) {
      throw new Error('already pill-tong.yml exists');
    }

    // write configuration file
    const configuration = fs.readFileSync(path.resolve(this.dir, 'pill-tong-conf')).toString();
    fs.writeFileSync(path.resolve(this.cwd, 'pill-tong.yml'), configuration);

    // complete message
    console.log([
      ' ',
      _.repeat('-', 10),
      'pill-tong created!',
      'now, please follow the following steps',
      ' ',
      `1. set-up the ${chalk.green('pill-tong.yml')} configuration file`,
      `2. ${chalk.red('configure the firewall rules')} (real server port: private, proxy server port: public)`,
      `3. enter the ${chalk.blue('pilltong')} command`,
      _.repeat('-', 10),
      ' ',
    ].join('\n'));
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
