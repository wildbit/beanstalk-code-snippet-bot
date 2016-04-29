import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'

// TODO: this needs to work in multi-team mode
// Set up ENV variables
const bsUsername = process.env.BS_USERNAME
const bsAuthToken = process.env.BS_AUTH_TOKEN

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

// Spawn worker processes when teams are added
beepboop.on('add_resource', (message) => {
    Object.keys(beepboop.workers).forEach((id) => {
      // Create instance of botkit worker
      var bot = beepboop.workers[id]
    })
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
