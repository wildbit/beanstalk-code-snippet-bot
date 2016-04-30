import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

const beanstalkAuthMap = {}

// Spawn worker processes when teams are added
beepboop.on('add_resource', (message) => {

    // TODO: This seems to have a problem if more than one team is sharing BS auth info
    console.log(message.resourceID);
    console.log(typeof message.resourceID)
    beanstalkAuthMap[message.resourceID] = {
        bsUsername: message.resource.BS_USERNAME,
        bsAuthToken: message.resource.BS_AUTH_TOKEN
    }

    // TODO: Better handling if we don't recognize message
    // TODO: Better error handling if BS credentials are incorrect
})

beepboop.on('update_resource', (message) => {
    console.log('**************************')
    console.log('Resource being updated')
    console.log(message)
    beanstalkAuthMap[message.resourceID].bsUsername = message.resource.BS_USERNAME;
    beanstalkAuthMap[message.resourceID].bsAuthToken = message.resource.BS_AUTH_TOKEN;
    // TODO: handle this - Update team's auth details
})

beepboop.on('remove_resource', (message) => {
    console.log('**************************')
    console.log('Resource being removed')
    console.log(message)
    // TODO: handle this - Remove team's auth details
})


controller.hears(
    ['.beanstalkapp.com/'],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {

        // TODO: validate whether authDetails exists for this team
        let authDetails = beanstalkAuthMap[botInstance.config.resourceID]

      console.log('**************************')
      console.log(authDetails)
        getFileContents(message.text, {
            username: authDetails.bsUsername,
            token: authDetails.bsAuthToken
        }, (err, res) => {
            if (err) {
              throw new Error(`Error getting file contents: ${ err.message }`)
            }

          // TODO: it's responding as bot.yml
            botInstance.reply(message, res)
        })
    })

controller.hears(
    ['help'],
    ['direct_message', 'direct_mention', 'mention'],
    (botInstance, message) => {
      console.log(beanstalkAuthMap)
      console.log('**************************')
      console.log(botInstance.config.resourceID)
      console.log(beanstalkAuthMap[botInstance.config.resourceID])
        botInstance.reply(message, HELP_MESSAGE)
    })

