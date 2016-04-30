'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var HELP_MESSAGE = exports.HELP_MESSAGE = 'I paste snippet code from Beanstalk links. \n\n' + '_How to get started_\n' + '1. Browse to a specific file in one of your Beanstalk repositories \n' + '2. In Beanstalk, click on the line of code you want to share \n' + '3. Copy the URL from your browser and paste it into slack \n' + ':champagne: :champagne:';

var EMPTY_REQUEST = exports.EMPTY_REQUEST = "I'll need a valid URL to the file on Beanstalk";

var ERROR_MESSAGE = exports.ERROR_MESSAGE = 'We had an issue getting the snippet from Beanstalk. Please make sure that you entered the correct username and authorization token.';

var MISSING_AUTH = exports.MISSING_AUTH = 'We could not find your Team\'s Beanstalk Authorization info. Please go fill it out.';

var UNRECOGNIZED_REQUEST = exports.UNRECOGNIZED_REQUEST = 'I didn\'t understand that. Try asking for `help` or paste a Beanstalk file URL.';

var BS_URL_MATCH = exports.BS_URL_MATCH = '.beanstalkapp.com/';