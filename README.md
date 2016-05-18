# beanstalk-code-snippet-bot [![Build Status](https://travis-ci.org/wildbit/beanstalk-code-snippet-bot.svg?branch=master)](https://travis-ci.org/wildbit/beanstalk-code-snippet-bot) <a href='https://beepboophq.com/api/slack/auth/add-to-slack/013fdba9e41a4803aa76f1761afd4eae'><img alt='Add to Slack' height='40' width='139' src='https://platform.slack-edge.com/img/add_to_slack.png' srcset='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x' /></a>

A Slack Bot that displays the contents of a file from your Beanstalk repository. So, instead of this: 

![Before](https://dl.dropboxusercontent.com/s/pkylbo81nn1294n/2016-05-18%20at%2012.10.png)

you can see something like this:

![After](https://dl.dropboxusercontent.com/s/ktzdwn5qax4065v/2016-05-16%20at%2016.52.png)

## Usage
- In Slack, use the `/code` command to add a file from Beanstalk as a code snippet. `/code [Beanstalk file URL]`
- This bot will listen for Beanstalk file URLs in any channel that it's a member of. Send an invite using `/invite @beanstalk-snippet-bot`

## Build and manage it yourself
Build and manage your own instance of this bot by following these instructions.

### Requirements
* [Beep Boop](https://beepboophq.com) account
* [Beanstalk](https://beanstalkapp.com) account with authorization token
* [Slack](https://slack.com) account with admin privileges

### Set up
1. Fork this repo onto your Github account
1. Create a new project on [Beep Boop](https://beepboophq.com) from your forked repo.
1. You might need to make an empty commit to trigger the build.
1. Once Beep Boop successfully builds, navigate to the settings page on Beep Boop.
1. Create a bot integration on your slack team and enter the API token onto Beep Boop's settings page.
1. Enter your Beanstalk username and authorization token onto Beep Boop's settings page.
1. Start your bot!

## MIT license
See the [LICENSE](https://github.com/wildbit/beanstalk-code-snippet-bot/blob/master/LICENSE) file (MIT).



