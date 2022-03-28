const Agenda = require('agenda'); //  agenda 或者 bull   
const mongoConnectionString = "mongodb://127.0.0.1/agenda";
const agenda = new Agenda({ db: { address: mongoConnectionString } })

module.exports = app => {
  console.log('app.schedule.scene', app)

  // 初始化 分布式调度任务
  // 同理，也可将该逻辑 直接放入 agent 进程中
  // 
  agenda.define(
    "job:send-email-report",
    // { priority: "high", concurrency: 10 },
    async (job) => {
      // const { to } = job.attrs.data;
      // 定义需要执行的 job 
      
      app.messenger.sendToAgent('xx-job', {});

    }
  );

  // 配置 job 执行规则
  (async function () {
    await agenda.start();
    await agenda.every("0 0 8 * * *", "job:send-email-report", {
      to: "admin@example.com",
    });
  })();

  // setInterval(() => {
  //   app.messenger.sendToAgent('xx-job', {});
  // }, 10 * 1000)
  
}
