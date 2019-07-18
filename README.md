# fb-chat-reminder

> ⏰ Send reminders to your friends through Facebook - from right inside your terminal.

[![PRs Welcome](https://badgen.net/badge/PRs/welcome/green)](https://github.com/szekelymilan/fb-chat-reminder/pulls)
[![Latest Release](https://badgen.net/github/release/szekelymilan/fb-chat-reminder)](https://github.com/szekelymilan/fb-chat-reminder/releases/latest)
[![MIT License](https://badgen.net/badge/license/MIT/blue)](https://github.com/szekelymilan/fb-chat-reminder/blob/master/LICENSE)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributors](#contributors)
- [License](#license)

## Description

Send reminders to your friends at fixed times of the day. You can create new reminders and delete the old ones easily using the **interactive mode**! 😎

The main process should be up and running to be able to send the messages.

## Features

- ⚡ Interactive mode
- 🕹 Automatic sending process
- 🛡️ Secure (your login crendetials are not stored)
- ✅ Tested
- ⛏ Maintained

## Installation

#### npm

```
$ npm i -g fb-chat-reminder
```

#### yarn

```
$ yarn global add fb-chat-reminder
```

## Usage

```
$ chatrem --help

Send reminders to your friends through Facebook - from right inside your terminal.

Usage
  $ chatrem <start|list|create|delete|login> [options]

Options
  Start main process:
    $ chatrem start

  List reminders:
    $ chatrem list

  Create a reminder:
    $ chatrem create <userID> <message> <time>
    For finding userIDs, you can use findmyfbid.com.
    Time should be in HH:MM 24h format.

  Delete a reminder:
    $ chatrem delete <reminderID>
    You can retrieve the IDs from the reminders list.

  Log in with your Facebook account:
    $ chatrem login <email> <password>
    Your account is being used for accessing your friend list and sending the messages.

  Interactive mode will be used if there are no options given or the --interactive flag is passed.

Examples
  See: https://github.com/szekelymilan/fb-chat-reminder#examples
```

## Examples

#### Create a reminder for the person with userID "1" at 3:00 PM to take his pills

```
$ chatrem create "1" "Take your pills!" "15:00"
Your reminder has been created successfully.
```

#### Delete the reminder with ID "vHnGRQCdj"

```
$ chatrem delete "vHnGRQCdj"
Your reminder has been deleted successfully.
```

## Contributors

- Many thanks to Reka Zetenyi for this great idea.

## License

MIT © [Milan Szekely](https://github.com/szekelymilan)
