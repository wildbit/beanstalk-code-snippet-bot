import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

const beanstalkAuthMap = {}

beepboop.on('add_resource', (message) => {
    // When a team connects, persist their data so we can look it up later
    beanstalkAuthMap[message.resourceID] = {
        bsUsername: message.resource.BS_USERNAME,
        bsAuthToken: message.resource.BS_AUTH_TOKEN
    }
})

beepboop.on('update_resource', (message) => {
    // When a team updates their auth info, update their persisted data
    beanstalkAuthMap[message.resourceID].bsUsername = message.resource.BS_USERNAME;
    beanstalkAuthMap[message.resourceID].bsAuthToken = message.resource.BS_AUTH_TOKEN;
})

beepboop.on('remove_resource', (message) => {
    // When a team removes this bot, remove their data
    delete beanstalkAuthMap[message.resourceID]
})


controller.hears(
    ['.beanstalkapp.com/'],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {

        // TODO: validate whether authDetails exists for this team
        let authDetails = beanstalkAuthMap[botInstance.config.resourceID]

        getFileContents(message.text, {
            username: authDetails.bsUsername,
            token: authDetails.bsAuthToken
        }, (err, res) => {
            if (err) {
              botInstance.reply(message, `We had an issue getting the snippet from Beanstalk. Please make sure that you entered the correct username and authorization token.` )
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

// TODO: Better handling if we don't recognize message
