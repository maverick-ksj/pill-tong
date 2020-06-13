const fs = require('fs');
const https = require('https');

const yaml = require('yaml');
const _ = require('lodash');

// const proxy = require('koa-proxies');

const app = new (require('koa'))();
const proxy = new require('http-proxy').createProxyServer();

class A {
  constructor() {
    this.env = yaml.parse(fs.readFileSync('./aa.yml').toString());
  }

  run() {
    /*
    https.createServer({
      key: fs.readFileSync('./ssl/private.pem'),
      cert: fs.readFileSync('./ssl/public.pem'),
    }, (req, res) => {
      proxy.web(req, res, {
        target: {
          host: 'localhost',
          port: this.port.target,
        },
      });
    }).listen(this.port.proxy);
    */

    app.use(async (ctx) => {
      proxy.web(ctx.req, ctx.res, {
        target: {
          host: 'localhost',
          port: this.port.target,
        },
      });
    }).listen(this.port.proxy);

    /*
    app.use(proxy('/', {
      target: {
        host: 'localhost',
        port: this.port.target,
      },
      events: {
        proxyReq(proxyReq, req, res) {
          // console.log(req);
          console.log('!');
        },
      },
    }));

    app.listen(8080);
    */

    /*
    https.createServer({
      key: fs.readFileSync('./ssl/private.pem'),
      cert: fs.readFileSync('./ssl/public.pem'),
    }, app.callback()).listen('8080');

    app.use(async ({ req, res }) => {
      proxy.web(req, res, {
        target: {
          host: 'localhost',
          port: this.port.target,
        },
      });

      console.log(ctx);
      ctx.body = 'test';
    });
    */

    /*
    https.createServer({
      key: fs.readFileSync('./ssl/private.pem'),
      cert: fs.readFileSync('./ssl/public.pem'),
    }, (req, res) => {
      proxy.web(req, res, {
        target: {
          host: 'localhost',
          port: this.port.target,
        },
      });
    }).listen(this.port.proxy);
    */

    console.log(`proxy:${this.port.proxy} ---> target:${this.port.target}`);
  }

  get port() {
    return this.env.port;
  }
}

new A().run();
