'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _constants = require('./constants');

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _beepboopBotkit = require('beepboop-botkit');

var _beepboopBotkit2 = _interopRequireDefault(_beepboopBotkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = _botkit2.default.slackbot();
var beepboop = _beepboopBotkit2.default.start(controller);

var beanstalkAuthMap = {};

// Spawn worker processes when teams are added
beepboop.on('add_resource', function (message) {

    // TODO: This seems to have a problem if more than one team is sharing BS auth info
    console.log(message.resourceID);
    console.log(_typeof(message.resourceID));
    beanstalkAuthMap[message.resourceID] = {
        bsUsername: message.resource.BS_USERNAME,
        bsAuthToken: message.resource.BS_AUTH_TOKEN
    };

    // TODO: Better handling if we don't recognize message
    // TODO: Better error handling if BS credentials are incorrect
});

beepboop.on('update_resource', function (message) {
    console.log('**************************');
    console.log('Resource being updated');
    console.log(message);
    beanstalkAuthMap[message.resourceID].bsUsername = message.resource.BS_USERNAME;
    beanstalkAuthMap[message.resourceID].bsAuthToken = message.resource.BS_AUTH_TOKEN;
    // TODO: handle this - Update team's auth details
});

beepboop.on('remove_resource', function (message) {
    console.log('**************************');
    console.log('Resource being removed');
    console.log(message);
    // TODO: handle this - Remove team's auth details
});

controller.hears(['.beanstalkapp.com/'], ['ambient', 'direct_mention', 'direct_message', 'mention'], function (botInstance, message) {

    // TODO: validate whether authDetails exists for this team
    var authDetails = beanstalkAuthMap[botInstance.config.resourceID];

    console.log('**************************');
    console.log(authDetails);
    (0, _utils.getFileContents)(message.text, {
        username: authDetails.bsUsername,
        token: authDetails.bsAuthToken
    }, function (err, res) {
        if (err) {
            throw new Error('Error getting file contents: ' + err.message);
        }

        // TODO: it's responding as bot.yml
        botInstance.reply(message, res);
    });
});

controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], function (botInstance, message) {
    console.log(beanstalkAuthMap);
    console.log('**************************');
    console.log(botInstance.config.resourceID);
    console.log(beanstalkAuthMap[botInstance.config.resourceID]);
    botInstance.reply(message, _constants.HELP_MESSAGE);
});