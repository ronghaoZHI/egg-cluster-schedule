/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1648297401542_8427';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.redis = {
    client: {
      // keyPrefix: 'zz:fe:offline:',
      // host: 'test19685.rdb.zhuaninc.com',
      // port: 6047,
      // password: '725c67421c26d8ba',
      // db: '0',
    },
    agent: true,
  };


  return {
    ...config,
    ...userConfig,
  };
};
