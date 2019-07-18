const { green, red } = require('chalk');
const Fuse = require('fuse.js');
const inquirer = require('inquirer');
const utils = require('./utils');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = async (id = '') => {
  let answers;

  if (id != '') {
    answers = { reminder: id };
  } else {
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

    remindersPrompt.forEach(e => {
      e.str = `${userInfo[e.person].name.trim()} - ${e.message} - ${utils.prependingZero(
        e.time.hours,
      )}:${utils.prependingZero(e.time.minutes)}`;
    });

    const fuse = new Fuse(remindersPrompt, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['str'],
    });

    answers = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'reminder',
        message: 'Reminder:',
        source: function(answers, input = '') {
          return new Promise(function(resolve) {
            if (input.length < 1)
              return resolve(remindersPrompt.map(e => ({ name: e.str, value: e.id })));

            resolve(fuse.search(input).map(e => ({ name: e.str, value: e.id })));
          });
        },
      },
    ]);
  }

  let exist = false;

  const reminders = (utils.conf.get('reminders') || []).filter(obj => {
    if (obj.id == answers['reminder']) {
      exist = true;
      return false;
    }

    return true;
  });

  utils.conf.set('reminders', reminders);
  console.log(
    exist
      ? green('Your reminder has been deleted successfully.')
      : red('No reminders found with the specified ID.'),
  );
};
