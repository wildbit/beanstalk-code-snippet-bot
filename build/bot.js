'use strict';

var _utils = require('./utils');

var _constants = require('./constants');

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _beepboopBotkit = require('beepboop-botkit');

var _beepboopBotkit2 = _interopRequireDefault(_beepboopBotkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN;
var bsUsername = process.env.BS_USERNAME;
var bsAuthToken = process.env.BS_AUTH_TOKEN;

if (!slackToken) {
    console.error('SLACK_TOKEN is required!');
    process.exit(1);
}

var controller = _botkit2.default.slackbot();

if (process.env.NODE_ENV === 'dev') {
    var bot = controller.spawn({
        token: slackToken
    });

    bot.startRTM(function (err) {
        if (err) {
            throw new Error('Could not connect to Slack');
        }
    });
} else {
    (function () {
        var beepboop = _beepboopBotkit2.default.start(controller);

        // Spawn worker processes when teams are added
        beepboop.on('add_resource', function (message) {
            Object.keys(beepboop.workers).forEach(function (id) {
                // Create instance of botkit worker
                var bot = beepboop.workers[id];
            });
        });
    })();
}

// TODO: setup process with API token to account. We're going to do this later...

controller.hears(['.beanstalkapp.com/'], ['ambient', 'direct_mention', 'direct_message', 'mention'], function (botInstance, message) {
    (0, _utils.getFileContents)(message.text, {
        username: bsUsername,
        token: bsAuthToken
    }, function (err, res) {
        if (err) {
            throw new Error('Error getting file contents: ' + err.message);
        }

        botInstance.reply(message, res);
    });
});

controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], function (botInstance, message) {
    botInstance.reply(message, _constants.HELP_MESSAGE);
});