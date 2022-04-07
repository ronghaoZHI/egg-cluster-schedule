## egg-agenda

egg 定时任务分布式调度插件，防止集群定时任务重复执行多次。

## QuickStart

### 1. 安装

`npm i egg-agenda`

### 2. 配置 
`/config/config.{default}.js` 
```js
config.agenda = {
  db: {
    address: 'mongodb://127.0.0.1/test', // 必填项， mongodb 地址
    collection: 'eggAgendaJobs'
  },
  defaultLockLifetime: 60 * 1000,
}
```
### 3.启用插件 
`/config/plugin.js`
```js
exports.clusterSchedule = {
  enable: true,
  package: 'egg-cluster-schedule',
};
```
### 4.改造现有 schedule 

`/app/schedule/xxx.js`
```js
module.exports = {
  schedule: {
    type: 'cluster', // type 改成 cluster 即可, 其他配置保持不变
    //... 
  },
  async task(ctx) {
    // 执行的任务 ctx.service.xxx()
    // ...
  }
}

```


## 更多资料
[egg 插件开发]: https://www.eggjs.org/zh-CN/advanced/plugin
[agenda 调度系统]: https://github.com/agenda/agenda