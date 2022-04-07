const Agenda = require('agenda'); // agenda 或者 bull   
const assert = require('assert')
const ms = require('humanize-ms');

module.exports = (agent) => {
  let count = 0;
  assert('config.agenda.db.address: %s, ', agent.config.agenda.db.address);
  assert('config.agenda.db.collection: %s', agent.config.agenda.db.collection);

  if(!agent.config.agenda.db || !agent.config.agenda.db.address) {
    assert('please check agent.config.agenda.db config');
    return
  }
  // 初始化 agenda
  let agenda;
  try {
    agenda = new Agenda(agent.config.agenda);
    // job 每次执行都会 触发 start 
    agenda.on("start", (job) => {
      assert(`Job starting: ${job.attrs.name}`);

      agenda.on("fail", (err, job) => {
        assert(`Job error: ${job.attrs.name}`, err);
      });
    });
    assert('init agenda success');
  } catch (error) {
    assert('new Agenda', error);
    return
  }
  //添加调度任务
  const addAgendaJob = async (ctx ,opt) => {
    const { agent, name, corn, interval } = opt;
    assert(`AgendaJob No.${count++}`);
    // console.log('addAgendaJob', { name, interval, corn });
    if(corn) {
      agenda.define(name, async (job) => {
        agent.emit(name, ctx.schedule);
      });
      
      await agenda.every(corn, name);
    } else if(interval) {
      const msTime = ms(interval);
      agenda.define(name, async (job) => {
        agent.emit(name, ctx.schedule);
      });

      await agenda.every(`${msTime / 1000} seconds`, name);
    }

    agent.on(name, (...args) => {
      // console.log(`agent.on ${name}`,  args)
      // 触发 egg schedule 任务，只允许一个 worker 进程
      ctx.sendOne(...args);
    });
  }

  class ClusterStrategy extends agent.ScheduleStrategy {
    start() {
      ;(async () => {
        const { key, schedule } = this
        if(schedule.type === 'cluster') {
          if(schedule.corn) {
            await addAgendaJob(this, { agent, name: key, corn: schedule.corn })
          } else if(schedule.interval) {
            await addAgendaJob(this, { agent, name: key, interval: schedule.interval })
          }
        }
      })();
    }
  }

  agent.schedule.use('cluster', ClusterStrategy);

  agent.messenger.on('egg-ready', async () => {
    assert('---egg-ready---agenda.start');
    await agenda.start();

    // 进程结束时需要解锁调度任务
    async function graceful() {
      assert('---- process-exit ---')
      console.log('---- agent process exit ---');
      await agenda.stop();
      process.exit(0);
    }

    process.on("SIGTERM", graceful);
    process.on("SIGINT", graceful);
  });

  agent.beforeClose(() => {
    console.log('agent.beforeClose');
  })
}