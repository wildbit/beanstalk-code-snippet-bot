var Botkit = require('botkit')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

var controller = Botkit.slackbot()
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})

// TODO: setup process with API token to account. We're going to do this later...

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['.beanstalkapp.com/'], ['ambient','direct_mention','direct_message','mention'], function(bot, message) {

    console.log('Grabbing snippet from ' + message.text)
    bot.reply(message, "Hang tight, let me grab you the snippet...")

    // TODO: pass URL off to Andrey and return results
    var code = '```' +
               '<a href="#">test</a>' +
               '<p>test</p>' +
               '```'
    bot.reply(message, code)

})

controller.hears(['help'],['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  var help = 'I paste snippet code from Beanstalk links. \n\n' +
             '_How to get started_\n' +
             '1. Browse to a specific file in one of your Beanstalk repositories \n' +
             '2. In Beanstalk, click on the line of code you want to share \n' +
             '3. Copy the URL from your browser and paste it into slack \n' +
             ':champagne: :champagne:'

  bot.reply(message, help)
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
