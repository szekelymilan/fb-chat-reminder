const configstore = require('configstore');
const fbAPI = require('facebook-chat-api');
const util = require('util');

exports.pkg = require('../package.json');
exports.conf = new configstore(exports.pkg.name);

exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

exports.prependingZero = number => number.toString().replace(/^(\d)$/, '0$1');

exports.getFriends = async () => {
  if (!exports.conf.get('appState'))
    return console.error(red('No active session found. Please log in.'));

  try {
    const api = await util.promisify(fbAPI)(
      { appState: exports.conf.get('appState') },
      { logLevel: 'silent' },
    );
    exports.conf.set('appState', api.getAppState());
    try {
      return await util.promisify(api.getFriendsList)();
    } catch (err) {
      console.error(red(err));
    }
  } catch (err) {
    console.error(red('Your session has expired. Please log in again.'));
  }
};

exports.getUserInfo = async ids => {
  if (!exports.conf.get('appState'))
    return console.error(red('No active session found. Please log in.'));

  try {
    const api = await util.promisify(fbAPI)(
      { appState: exports.conf.get('appState') },
      { logLevel: 'silent' },
    );
    exports.conf.set('appState', api.getAppState());
    try {
      return await util.promisify(api.getUserInfo)(ids);
    } catch (err) {
      console.error(red(err));
    }
  } catch (err) {
    console.error(red('Your session has expired. Please log in again.'));
  }
};

exports.sendMessage = async (id, message) => {
  if (!exports.conf.get('appState'))
    return console.error(red('No active session found. Please log in.'));

  try {
    const api = await util.promisify(fbAPI)(
      { appState: exports.conf.get('appState') },
      { logLevel: 'silent' },
    );
    exports.conf.set('appState', api.getAppState());
    try {
      return await util.promisify(api.sendMessage)(message, id);
    } catch (err) {
      console.error(red(err));
    }
  } catch (err) {
    console.error(red('Your session has expired. Please log in again.'));
  }
};
