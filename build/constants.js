'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var HELP_MESSAGE = exports.HELP_MESSAGE = 'I paste snippet code from Beanstalk links. \n\n' + '_How to get started_\n' + '1. Browse to a specific file in one of your Beanstalk repositories \n' + '2. In Beanstalk, click on the line of code you want to share \n' + '3. Copy the URL from your browser and paste it into slack \n' + ':champagne: :champagne:';

var EMPTY_REQUEST = exports.EMPTY_REQUEST = "I'll need a valid URL to the file on Beanstalk";

var ERROR_MESSAGE = exports.ERROR_MESSAGE = 'Error getting file contents: ';