const Agenda = require('agenda'); // bull 
const mongoConnectionString = "mongodb://127.0.0.1/agenda";
const agenda = new Agenda({ db: { address: mongoConnectionString } })

module.exports = app => {
  console.log('app.schedule.scene', app)

  // 初始化 分布式调度任务
  // 
  agenda.define(
    "job:send-email-report",
    // { priority: "high", concurrency: 10 },
    async (job) => {
      // const { to } = job.attrs.data;

      app.messenger.sendToAgent('xx-job', {});

     

      // 假设发邮件
      // await emailClient.send({
      //   to,
      //   from: "example@example.com",
      //   subject: "Email Report",
      //   body: "...",
      // });
    }
  );

  // 配置 job 执行
  (async function () {
    await agenda.start();
    await agenda.every("0 0 8 * * *", ["job:send-email-report"], {
      to: "admin@example.com",
    });
  })();

  // setInterval(() => {
  //   app.messenger.sendToAgent('xx-job', {});
  // }, 10 * 1000)
  
}