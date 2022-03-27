// 
// const quartz = require('node-quartz')({})

// quartz.scheduleJob({
//   id: 'job_id',
//   script: './scheduleJob.js',
//   cron: '*/2 * * * *',
//   options: {
//     currentDate: null,
//     endDate: null
//   },
// })

module.exports = (agent) => {
  // console.dir(agent)

  class ClusterStrategy extends agent.ScheduleStrategy {
    start() {
      // console.log(this.schedule)
      // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
      // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
      // agent.mq.subscribe(this.schedule.scene, () => this.sendOne(agent.mq, this.schedule.scene));

      // 订阅其他的分布式调度服务发送的消息 比如： xxljob quartz ...
      // 
      agent.messenger.on('xx-job', (...args) => {
        console.log('agent.messenger.on: xx-job', args)

        this.sendOne(this.schedule.scene, '1111');
      });
    }
  }

  agent.schedule.use('cluster', ClusterStrategy);
};