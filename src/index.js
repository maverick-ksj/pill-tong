const fs = require('fs');
const https = require('https');

const yaml = require('yaml');
const _ = require('lodash');
const queryStringParser = require('query-string').parse;

const xss = require('xss');

const proxy = new require('http-proxy').createProxyServer();

class A {
  constructor() {
    // parse environments
    this.env = yaml.parse(fs.readFileSync('./aa.yml').toString());

    // create ssl server
    https.createServer({
      key: fs.readFileSync(this.sslCert.key),
      cert: fs.readFileSync(this.sslCert.cert),
    }, async (req, res) => {
      const queryString = await new Promise((resolve) => {
        resolve(queryStringParser(req.url.match(/^\/[\?]?(.*)/)[1]));
      });

      const body = await new Promise((resolve) => {
        let cs = '';
        req.on('data', (c) => cs += c);
        req.on('end', () => resolve(queryStringParser(cs)));
      });

      if (
        !(
          xss(JSON.stringify(queryString)) === JSON.stringify(queryString) &&
          xss(JSON.stringify(body)) === JSON.stringify(body)
        )
      ) {
        res.end('failed');
      } else {
        proxy.web(req, res, {
          target: {
            host: this.target.host,
            port: this.target.port,
          },
        });
      }
    }).listen(this.proxy.port);

    // init msg
    console.log(`proxy:${this.proxy.port} ---> target:${this.target.port}`);
  }

  get target() {
    return this.env.target;
  }

  get proxy() {
    return this.env.proxy;
  }

  get sslCert() {
    return this.env.cert;
  }
}

new A();
