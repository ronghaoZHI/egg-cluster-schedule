// 
module.exports = {
  schedule: {
    scene: 'job:test2',
    type: 'cluster',
  },
  async task(ctx, ...args) {

    console.log(args);
    console.log('定时任务 test2');

    // const res = await ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // ctx.app.cache = res.data;
  },
};