#!/usr/bin/env bash

export PORT=80
export SLACK_VERIFY_TOKEN=[YOUR_SLACK_VERIFY_TOKEN] # https://api.slack.com/slash-commands
export SLACK_TOKEN=[YOUR_SLACK_TOKEN]
export BS_USERNAME=[YOUR_BEANSTALK_USERNAME]
export BS_AUTH_TOKEN=[YOUR_BEANSTALK_AUTH_TOKEN]
export NODE_ENV=dev
npm run start:dev
