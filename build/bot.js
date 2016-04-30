'use strict';

var _utils = require('./utils');

var _constants = require('./constants');

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _beepboopBotkit = require('beepboop-botkit');

var _beepboopBotkit2 = _interopRequireDefault(_beepboopBotkit);

var _nodePersist = require('node-persist');

var _nodePersist2 = _interopRequireDefault(_nodePersist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = _botkit2.default.slackbot();
var beepboop = _beepboopBotkit2.default.start(controller);

beepboop.on('add_resource', function (message) {
    // When a team connects we persist their data so we can look it up later.
    // This also runs for each connected team every time the bot is started.
    setStorage(message);
});

beepboop.on('update_resource', function (message) {
    // When a team updates their auth info we update their persisted data.
    setStorage(message);
});

function setStorage(message) {
    _nodePersist2.default.setItem(message.resourceID, {
        bsUsername: message.resource.BS_USERNAME,
        bsAuthToken: message.resource.BS_AUTH_TOKEN,
        slackTeamID: message.resource.SlackTeamID
    });
}

beepboop.on('remove_resource', function (message) {
    // When a team removes this bot we remove their data.
    _nodePersist2.default.removeItem(message.resourceID);
});

controller.hears([_constants.BS_URL_MATCH], ['ambient', 'direct_mention', 'direct_message', 'mention'], function (botInstance, message) {

    var team = _nodePersist2.default.getItem(botInstance.config.resourceID);

    // Validate Beanstalk Auth Info
    if (team.bsUsername === '' || team.bsAuthToken === '') {
        botInstance.reply(message, _constants.MISSING_AUTH);
    }

    (0, _utils.getFileContents)(message.text, {
        username: team.bsUsername,
        token: team.bsAuthToken
    }, function (err, res) {
        if (err) {
            botInstance.reply(message, _constants.ERROR_MESSAGE);
            throw new Error('Error getting file contents: ' + err.message);
        }

        botInstance.reply(message, res);
    });
});

controller.hears(['help'], ['direct_message', 'direct_mention', 'mention'], function (botInstance, message) {
    botInstance.reply(message, _constants.HELP_MESSAGE);
});

controller.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function (botInstance, message) {
    botInstance.reply(message, _constants.UNRECOGNIZED_REQUEST);
});