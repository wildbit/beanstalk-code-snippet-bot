/* eslint max-len: 0 */

const HELP_MESSAGE = 'I paste snippet code from Beanstalk links. \n\n' +
    '_How to get started_\n' +
    '1. Browse to a specific file in one of your Beanstalk repositories \n' +
    '2. In Beanstalk, click on the line of code you want to share \n' +
    '3. Copy the URL from your browser and paste it into slack \n' +
    ':champagne: :champagne:'

const EMPTY_REQUEST = "I'll need a valid URL to the file on Beanstalk"

const ERROR_MESSAGE = 'We had an issue getting the snippet from Beanstalk. Please make sure that you entered the correct username and authorization token.'

const MISSING_AUTH = 'We could not find your Team\'s Beanstalk Authorization info. Please go fill it out.'

const UNRECOGNIZED_REQUEST = 'I didn\'t understand that. Try asking for `help` or paste a Beanstalk file URL.'

const BS_URL_MATCH = '.beanstalkapp.com/'

module.exports = {
    HELP_MESSAGE,
    EMPTY_REQUEST,
    ERROR_MESSAGE,
    MISSING_AUTH,
    UNRECOGNIZED_REQUEST,
    BS_URL_MATCH
}
