import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
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
        botInstance.reply(message, HELP_MESSAGE)
    })
