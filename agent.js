const Agenda = require('agenda'); // agenda 或者 bull   
const mongoConnectionString = "mongodb://127.0.0.1/agenda";
let agenda;
try {
  agenda = new Agenda({ 
    db: { address: mongoConnectionString }, 
    defaultLockLifetime: 10000 
  });
  console.log('agenda', agenda)
} catch (error) {
  console.log(error)
}


module.exports = (agent) => {

  // setInterval(() => {
  //   agent.emit('xx-job', {})
  // }, 5 * )

  // 初始化分布式调度任务
  agenda.define(
    "job:send-email-report",
    // { priority: "high", concurrency: 10 },
    async (job) => {
      // const { to } = job.attrs.data;
      console.log(job.attrs.name);
      // 定义需要执行的 job 
      // 触发 agent 事件
      agent.emit('xx-job') // 对应的需要 agent.on('')
    }
  );

  agenda.on("start", (job) => {
    console.log("Job %s starting", job.attrs.name);
  });

  // 配置 job 执行规则
  (async function () {
    // await agenda.stop();
    await agenda.start();
    await agenda.every("*/5 * * * * *", "job:send-email-report");


    // 进程结束时需要停止关闭调度任务
    async function graceful() {
      console.log('---- process-exit ---')
      await agenda.stop();
      process.exit(0);
    }

    process.on("SIGTERM", graceful);
    process.on("SIGINT", graceful);
  })();

  agent.beforeStart(async () => {
    console.log('agent.beforeStart');

  })

  agent.beforeClose(() => {
    console.log('agent.beforeClose');
  })
  class ClusterStrategy extends agent.ScheduleStrategy {
    start() {
      // console.log(this.schedule)
      // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
      // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
      // agent.mq.subscribe(this.schedule.scene, () => this.sendOne());
      // 订阅其他的分布式调度服务发送的消息 比如： agenda bull xxljob quartz  ...
      // 
      agent.on('xx-job', (...args) => {
        console.log('agent.on: xx-job', args)
        // 触发 egg schedule 任务，只允许一个 worker 进程
        this.sendOne(this.schedule.scene, '1111');
      });
    }
  }

  agent.schedule.use('cluster', ClusterStrategy);
};