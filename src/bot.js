import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

// Spawn worker processes when teams are added
beepboop.on('add_resource', (message) => {
    Object.keys(beepboop.workers).forEach((id) => {

        //TODO: refactor this. there's a better way to do it.

        // Create instance of botkit worker
        var bot = beepboop.workers[id]

        controller.hears(
            ['.beanstalkapp.com/'],
            ['ambient', 'direct_mention', 'direct_message', 'mention'],
            (botInstance, message) => {
                getFileContents(message.text, {
                    username: bot.resource.BS_USERNAME,
                    token: bot.resource.BS_AUTH_TOKEN
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

    })

    // TODO: Better handling if we don't recognize message
    // TODO: Better error handling if BS credentials are incorrect
})

beepboop.on('update_resource', (message) => {
    // TODO: handle this
})

beepboop.on('remove_resource', (message) => {
    // TODO: handle this
})
