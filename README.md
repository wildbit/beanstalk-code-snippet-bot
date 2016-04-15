# beanstalk-code-snippet-bot
## Overview
A Slack Bot that displays the contents of a file from your Beanstalk repository. This project will show you how to install and run this bot on your slack team.

## Requirements
* [Beep Boop](https://beepboophq.com) account
* [Beanstalk](https://beanstalkapp.com) account with authorization token
* [Slack](https://slack.com) account with admin privileges

## Set up
1. Fork this repo onto your Github account
1. Create a new project on [Beep Boop](https://beepboophq.com) from your forked repo.
1. You might need to make an empty commit to trigger the build.
1. Once Beep Boop successfully builds, navigate to the settings page on Beep Boop.
1. Create a bot integration on your slack team and enter the API token onto Beep Boop's settings page.
1. Enter your Beanstalk username and authorization token onto Beep Boop's settings page.
1. Start your bot!

## Usage
This bot will listen for Beanstalk file URLs in any channel that it's a member of. Send an invite using `/invite @botname`

## MIT license
See the [LICENSE](https://github.com/wildbit/beanstalk-code-snippet-bot/blob/master/LICENSE) file (MIT).



