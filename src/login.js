const { green, red } = require('chalk');
const fbAPI = require('facebook-chat-api');
const inquirer = require('inquirer');
const utils = require('./utils');

module.exports = async (email = '', password = '', fn) => {
  const answers =
    email != '' && password != ''
      ? { email: email, password: password }
      : await inquirer.prompt([
          {
            type: 'input',
            name: 'email',
            message: 'Email or phone number:',
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password:',
          },
        ]);

  fbAPI(
    { email: answers['email'], password: answers['password'] },
    { logLevel: 'silent' },
    (err, api) => {
      if (err) {
        switch (err.error) {
          case 'login-approval':
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'code',
                  message: 'Enter code:',
                },
              ])
              .then(answers => {
                err.continue(answers['code']);
              });
            break;
          default:
            console.error(red(err.error));
            fn(err.error);
        }
        return;
      }

      utils.conf.set('appState', api.getAppState());
      console.log(green('You have successfully logged in.'));
      fn(null, true);
    },
  );
};
