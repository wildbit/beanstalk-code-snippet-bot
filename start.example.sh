#!/usr/bin/env bash

export PORT=80
export SLACK_VERIFY_TOKEN=[YOUR_SLACK_VERIFY_TOKEN] # https://api.slack.com/slash-commands
export BEEPBOOP_ID=[BEEP BOOP ID]
export BEEPBOOP_RESOURCER=[BEEP BOOP RESOURCER URL]
export BEEPBOOP_TOKEN=[BEEP BOOP TOKEN]

npm run start:dev
