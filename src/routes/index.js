const router = require('koa-router')();
// const context = require('../context');

router.get('/', async ctx => {
  await ctx.render('index', {
    title: 'easy-es',
    link: 'https://github.com/yuri2peter/easy-es'
  });
});


module.exports = router;
