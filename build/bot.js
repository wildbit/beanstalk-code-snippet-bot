'use strict';

var _utils = require('./utils');

var _constants = require('./constants');

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _beepboopBotkit = require('beepboop-botkit');

var _beepboopBotkit2 = _interopRequireDefault(_beepboopBotkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = _botkit2.default.slackbot();
var beepboop = _beepboopBotkit2.default.start(controller);

// Spawn worker processes when teams are added
beepboop.on('add_resource', function (message) {
    Object.keys(beepboop.workers).forEach(function (id) {

        //TODO: refactor this. there's a better way to do it.

        // Create instance of botkit worker
        var bot = beepboop.workers[id];

        controller.hears(['.beanstalkapp.com/'], ['ambient', 'direct_mention', 'direct_message', 'mention'], function (botInstance, message) {
            (0, _utils.getFileContents)(message.text, {
                username: bot.resource.BS_USERNAME,
                token: bot.resource.BS_AUTH_TOKEN
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
    });

    // TODO: Better handling if we don't recognize message
    // TODO: Better error handling if BS credentials are incorrect
});

beepboop.on('update_resource', function (message) {
    // TODO: handle this
});

beepboop.on('remove_resource', function (message) {
    // TODO: handle this
});