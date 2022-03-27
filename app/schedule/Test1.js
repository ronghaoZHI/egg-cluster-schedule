// 
module.exports = {
  schedule: {
    scene: 'job:test1',
    type: 'cluster',
  },
  async task(ctx, ...args) {

    // (JSON.stringify(args[0]));

    console.log(args);
    console.log('定时任务 Test1');

    // const res = await ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // ctx.app.cache = res.data;
  },
};