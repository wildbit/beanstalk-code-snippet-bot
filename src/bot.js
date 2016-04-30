import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

const beanstalkAuthMap = {}

// Spawn worker processes when teams are added
beepboop.on('add_resource', (message) => {

    const authDetails = {
      bsUsername: message.resource.BS_USERNAME,
      bsAuthToken: message.resource.BS_AUTH_TOKEN
    }

    beanstalkAuthMap[message.resourceID] = authDetails

    // TODO: Better handling if we don't recognize message
    // TODO: Better error handling if BS credentials are incorrect
})

beepboop.on('update_resource', (message) => {
    // TODO: handle this - Update team's auth details
})

beepboop.on('remove_resource', (message) => {
    // TODO: handle this - Remove team's auth details
})


controller.hears(
    ['.beanstalkapp.com/'],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {

        // TODO: validate whether authDetails exists for this team
        const authDetails = beanstalkAuthMap[botInstance.config.resourceID]

        getFileContents(message.text, {
            username: authDetails.bsUsername,
            token: authDetails.bsAuthToken
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

