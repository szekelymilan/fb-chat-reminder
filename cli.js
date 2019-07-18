#!/usr/bin/env node

const { bold, white } = require('chalk');
const inquirer = require('inquirer');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const util = require('util');

const _utils = require('./src/utils');
const _main = require('./src/main');
const _list = require('./src/list');
const _create = require('./src/create');
const _delete = require('./src/delete');
const _login = require('./src/login');

const cli = meow(
  `
 ${bold('Usage')}
   $ chatrem <start|list|create|delete|login> [options]

 ${bold('Options')}
   ${white('Start main process:')}
     $ chatrem start

   ${white('List reminders:')}
     $ chatrem list

   ${white('Create a reminder:')}
     $ chatrem create <userID> <message> <time>
     For finding userIDs, you can use findmyfbid.com.
     Time should be in HH:MM 24h format.

   ${white('Delete a reminder:')}
     $ chatrem delete <reminderID>
     You can retrieve the IDs from the reminders list.

   ${white('Log in with your Facebook account:')}
     $ chatrem login <email> <password>
     Your account is being used for accessing your friend list and sending the messages.

   Interactive mode will be used if there are no options given or the --interactive flag is passed.

 ${bold('Examples')}
   See: https://github.com/szekelymilan/fb-chat-reminder#examples
`,
  {
    flags: {
      interactive: {
        type: 'boolean',
        alias: 'i',
        default: false,
      },
    },
  },
);

const { interactive: INTERACTIVE } = cli.flags;

async function _interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tasks',
      message: 'Task(s):',
      choices: [
        { name: 'Start main process', value: 'start', checked: false },
        { name: 'List reminders', value: 'list', checked: false },
        { name: 'Create a reminder', value: 'create', checked: false },
        { name: 'Delete a reminder', value: 'delete', checked: false },
        { name: 'Log in with your Facebook account', value: 'login', checked: false },
      ],
    },
  ]);

  for (const task of answers['tasks']) {
    switch (task) {
      case 'start':
        await _main();
        break;
      case 'list':
        await _list();
        break;
      case 'create':
        await _create();
        break;
      case 'delete':
        await _delete();
        break;
      case 'login':
        await util.promisify(_login)('', '');
        break;
    }
  }
}

(async () => {
  updateNotifier({ pkg: _utils.pkg }).notify();

  if (cli.input.length < 1) {
    await _interactive();
    return;
  }

  switch (cli.input[0]) {
    case 'start':
      await _main();
      break;
    case 'list':
      await _list();
      break;
    case 'create':
      if (INTERACTIVE || cli.input.length < 4) {
        await _create();
        break;
      }
      await _create(cli.input[1], cli.input[2], cli.input[3]);
      break;
    case 'delete':
      if (INTERACTIVE || cli.input.length < 2) {
        await _delete();
        break;
      }
      await _delete(cli.input[1]);
      break;
    case 'login':
      try {
        if (INTERACTIVE || cli.input.length < 3) {
          await util.promisify(_login)('', '');
          break;
        }
        await util.promisify(_login)(cli.input[1], cli.input[2]);
      } catch (err) {}
      break;
    default:
      await _interactive();
  }

  process.exit();
})();
