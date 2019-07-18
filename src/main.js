const { green, red } = require('chalk');
const NanoTimer = require('nanotimer');
const utils = require('./utils');

const timer = new NanoTimer();

module.exports = async () => {
  console.log(green('The main process has been started.'));

  timer.setTimeout(
    () => {
      timer.setInterval(
        async () => {
          const date = new Date();

          await utils.asyncForEach(utils.conf.get('reminders') || [], async e => {
            if (e.time.hours != date.getHours() || e.time.minutes != date.getMinutes()) return;
            await utils.sendMessage(e.person, e.message);
          });
        },
        [],
        '60s',
      );
    },
    [],
    `${(70 - new Date().getSeconds()) % 60}s`,
  );

  await new Promise(resolve => {});
};
