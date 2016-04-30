/* eslint consistent-return: 0 */
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import storage from 'node-persist'
import { getFileContents } from './utils'
import { HELP_MESSAGE, EMPTY_REQUEST, ERROR_MESSAGE, BS_URL_MATCH, UNRECOGNIZED_REQUEST } from './constants'

const { SLACK_VERIFY_TOKEN, PORT } = process.env
if (!SLACK_VERIFY_TOKEN) {
    console.error('SLACK_VERIFY_TOKEN is required')
    process.exit(1)
}
if (!PORT) {
    console.error('PORT is required')
    process.exit(1)
}

const app = express()
app.use(morgan('dev'))

app.route('/code')
    .get((req, res) => {
        res.sendStatus(200)
    })
    .post(bodyParser.urlencoded({ extended: true }), (req, res) => {
        if (req.body.token !== SLACK_VERIFY_TOKEN) {
            return res.sendStatus(401)
        }

        const { text, response_url, team_id } = req.body

        // Handle empty request
        if (!text) {
            return res.json({
                response_type: 'ephemeral',
                text: EMPTY_REQUEST
            })
        }

        // Handle any help requests
        if (text === 'help') {
            return res.json({
                response_type: 'ephemeral',
                text: HELP_MESSAGE
            })
        }

        if (text.indexOf(BS_URL_MATCH) > -1) {
            // Iterate through storage data
            storage.forEach((key, value) => {

                // Match team ID in storage from request
                if (value.slackTeamID === team_id) {

                    // Get file contents from Beanstalk
                    getFileContents(text, {
                        username: value.bsUsername,
                        token: value.bsAuthToken
                    }, (err, content) => {
                        if (err) {
                            return res.json({
                                response_type: 'ephemeral',
                                text: ERROR_MESSAGE
                            })
                        }

                        // TODO: If this request takes more than 3000ms slack will not post our response. Instead we should probably return an initial message to the user("Looking up your file"). Then after send the file as an incoming webhook using response_url.
                        return res.json({
                            response_type: 'in_channel',
                            ...content
                        })
                    })
                }
            })
        } else {
            return res.json({
                response_type: 'ephemeral',
                text: UNRECOGNIZED_REQUEST
            })
        }

    })

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server: ', err)
    }

    return console.log('Server successfully started on port %s', PORT)
})
