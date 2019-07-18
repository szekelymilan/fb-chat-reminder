const { bold, white, red } = require('chalk');
const utils = require('./utils');

module.exports = async () => {
  const remindersPrompt = utils.conf.get('reminders') || [];

  if (remindersPrompt.length == 0) return console.error(red('You have no reminders.'));

  remindersPrompt.sort((a, b) => {
    if (
      a.time.hours < b.time.hours ||
      (a.time.hours == b.time.hours ? a.time.minutes < b.time.minutes : false)
    )
      return -1;
    if (a.time.hours == b.time.hours && a.time.minutes == b.time.minutes) return 0;
    if (
      a.time.hours > b.time.hours ||
      (a.time.hours == b.time.hours ? a.time.minutes > b.time.minutes : false)
    )
      return 1;
  });

  const userInfo = await utils.getUserInfo(remindersPrompt.map(e => e.person));

  console.log(bold('Your reminders:'));

  remindersPrompt.forEach(e => {
    console.log(
      white(
        `  ${userInfo[e.person].name.trim()} - ${e.message} - ${utils.prependingZero(
          e.time.hours,
        )}:${utils.prependingZero(e.time.minutes)} - ${e.id}`,
      ),
    );
  });
};
