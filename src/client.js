new (require('koa'))()
  .use(async (ctx) => {
    ctx.body = 'hi!';
  })
  .listen(3000, () => console.log('listen in :3000'));