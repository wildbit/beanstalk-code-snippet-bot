const getFileContents = require('./utils').getFileContents
const Botkit = require('botkit')
const BeepBoop = require('beepboop-botkit')
const storage = require('node-persist')
const {
    HELP_MESSAGE,
    ERROR_MESSAGE,
    MISSING_AUTH,
    BS_URL_MATCH,
    UNRECOGNIZED_REQUEST
} = require('./constants')

const controller = Botkit.slackbot()
const beepboop = BeepBoop.start(controller)

function setStorage(message) {
    storage.setItem(message.resourceID, {
        bsUsername: message.resource.BS_USERNAME,
        bsAuthToken: message.resource.BS_AUTH_TOKEN,
        slackTeamID: message.resource.SlackTeamID
    })
}

beepboop.on('add_resource', (message) => {
    // When a team connects we persist their data so we can look it up later.
    // This also runs for each connected team every time the bot is started.
    setStorage(message)
})

beepboop.on('update_resource', (message) => {
    // When a team updates their auth info we update their persisted data.
    setStorage(message)
})

beepboop.on('remove_resource', (message) => {
    // When a team removes this bot we remove their data.
    storage.removeItem(message.resourceID)
})


controller.hears(
    [BS_URL_MATCH],
    ['ambient', 'direct_mention', 'direct_message', 'mention'],
    (botInstance, message) => {

        const team = storage.getItem(botInstance.config.resourceID)

        // Validate Beanstalk Auth Info
        if (team.bsUsername === '' || team.bsAuthToken === '') {
            botInstance.reply(message, MISSING_AUTH)
        }

        // Make sure the message isn't from the slash command
        if (message.text.substr(0, 5) !== '/code') {
            getFileContents(message.text, {
                username: team.bsUsername,
                token: team.bsAuthToken
            }, (err, res) => {
                if (err) {
                    botInstance.reply(message, ERROR_MESSAGE)
                    throw new Error(`Error getting file contents: ${ err.message }`)
                }

                botInstance.reply(message, res)
            })
        }

    })

controller.hears(
    ['help'],
    ['direct_message', 'direct_mention', 'mention'],
    (botInstance, message) => {
        botInstance.reply(message, HELP_MESSAGE)
    })

controller.hears(
    ['.*'],
    ['direct_message', 'direct_mention', 'mention'],
    (botInstance, message) => {
        botInstance.reply(message, UNRECOGNIZED_REQUEST)
    })
