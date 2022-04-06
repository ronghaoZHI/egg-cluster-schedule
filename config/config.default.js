'use strict';
// more options visit https://github.com/agenda/agenda

exports.agenda = {
  db: {
    address: 'mongodb://127.0.0.1/test',
    collection: 'eggAgendaJobs'
  },
  defaultLockLifetime: 60 * 1000,
}
