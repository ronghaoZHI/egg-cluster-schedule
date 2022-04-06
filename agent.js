'use strict';

const agenda = require('./lib/agenda');

module.exports = (agent) => {
  if (agent.config.agenda) agenda(agent);
};