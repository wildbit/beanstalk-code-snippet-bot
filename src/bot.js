/* eslint no-console: 0 */

import { getFileContents } from './utils'
import Botkit from 'botkit'

// Expect a SLACK_TOKEN environment variable
const slackToken = process.env.SLACK_TOKEN
const bsUsername = process.env.BS_USERNAME
const bsAuthToken = process.env.BS_AUTH_TOKEN

if (!slackToken) {
    console.error('SLACK_TOKEN is required!')
    process.exit(1)
}

const controller = Botkit.slackbot()
const bot = controller.spawn({
    token: slackToken
})

bot.startRTM(err => {
    if (err) {
        throw new Error('Could not connect to Slack')
    }
})

// TODO: setup process with API token to account. We're going to do this later...

controller.hears(
    ['.beanstalkapp.com/'],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {
        getFileContents(message.text, {
            username: bsUsername,
            token: bsAuthToken
        }, (err, res) => {
            if (err) {
                throw new Error(`Error getting file contents: ${ err.message }`)
            }

            botInstance.reply(message, res)
        })
    })

controller.hears(
    ['help'],
    ['direct_message', 'direct_mention', 'mention'],
    (botInstance, message) => {
        const help = 'I paste snippet code from Beanstalk links. \n\n' +
            '_How to get started_\n' +
            '1. Browse to a specific file in one of your Beanstalk repositories \n' +
            '2. In Beanstalk, click on the line of code you want to share \n' +
            '3. Copy the URL from your browser and paste it into slack \n' +
            ':champagne: :champagne:'

        botInstance.reply(message, help)
    })
