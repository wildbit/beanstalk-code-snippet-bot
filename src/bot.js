import { getFileContents } from './utils'
import { HELP_MESSAGE } from './constants'
import Botkit from 'botkit'
import BeepBoop from 'beepboop-botkit'
import storage from 'node-persist'

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

beepboop.on('add_resource', (message) => {
    // When a team connects we persist their data so we can look it up later.
    // This also runs for each connected team every time the bot is started.
    setStorage(message)
})

beepboop.on('update_resource', (message) => {
    // When a team updates their auth info we update their persisted data.
    setStorage(message)
})

function setStorage(message) {
  storage.setItem(message.resourceID, {
    bsUsername: message.resource.BS_USERNAME,
    bsAuthToken: message.resource.BS_AUTH_TOKEN,
    slackTeamID: message.resource.SlackTeamID
  })
}

beepboop.on('remove_resource', (message) => {
    // When a team removes this bot we remove their data.
    storage.removeItem(message.resourceID)
})


controller.hears(
    ['.beanstalkapp.com/'],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {

        let team = storage.getItem(botInstance.config.resourceID);

        // Validate Beanstalk Auth Info
        if (team.bsUsername === '' || team.bsAuthToken === '') {
            botInstance.reply(message, `We could not find your Team's Beanstalk Authorization info. Please go fill it out.`)
        }

        getFileContents(message.text, {
            username: team.bsUsername,
            token: team.bsAuthToken
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
