const router = require('koa-router')();
const { upsert, get, search, remove } = require('../services/es');

router.get('/', async ctx => {
  await ctx.render('index', {
    title: 'easy-es',
    link: 'https://github.com/yuri2peter/easy-es',
  });
});

router.post('/upsert', async ctx => {
  ctx.body = await upsert(ctx.request.body);
});
router.post('/get', async ctx => {
  ctx.body = await get(ctx.request.body);
});
router.post('/search', async ctx => {
  ctx.body = await search(ctx.request.body);
});
router.post('/remove', async ctx => {
  ctx.body = await remove(ctx.request.body);
});

module.exports = router;
