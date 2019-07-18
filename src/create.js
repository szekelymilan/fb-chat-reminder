const { green, red } = require('chalk');
const Fuse = require('fuse.js');
const inquirer = require('inquirer');
const shortid = require('shortid');
const utils = require('./utils');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

module.exports = async (person = '', message = '', time = '') => {
  let answers;

  if (person != '' && message != '' && time != '') {
    if (!/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/.test(time))
      return console.error(red('Invalid time.'));

    const date = new Date();
    date.setHours(time.split(':')[0]);
    date.setMinutes(time.split(':')[1]);
    answers = { person: person, message: message, time: date };
  } else {
    const friends = (await utils.getFriends()).filter(obj => obj.userID != 0);

    friends.sort((a, b) => {
      if (a.firstName < b.firstName) return -1;
      if (a.firstName == b.firstName) return 0;
      if (a.firstName > b.firstName) return 1;
    });

    const fuse = new Fuse(friends, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['fullName', 'vanity'],
    });

    answers = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'person',
        message: 'Person:',
        source: function(answers, input = '') {
          return new Promise(function(resolve) {
            if (input.length < 1)
              return resolve(friends.map(e => ({ name: e.fullName.trim(), value: e.userID })));

            resolve(fuse.search(input).map(e => ({ name: e.fullName.trim(), value: e.userID })));
          });
        },
      },
      {
        type: 'input',
        name: 'message',
        message: 'Message:',
      },
      {
        type: 'datetime',
        name: 'time',
        message: 'Time:',
        format: ['HH', ':', 'MM'],
      },
    ]);
  }

  const reminder = {
    id: shortid.generate(),
    person: answers['person'],
    message: answers['message'],
    time: { hours: answers['time'].getHours(), minutes: answers['time'].getMinutes() },
  };

  const reminders = utils.conf.get('reminders') || [];
  reminders.push(reminder);

  utils.conf.set('reminders', reminders);
  console.log(green('Your reminder has been created successfully.'));
};
