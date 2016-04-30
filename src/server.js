/* eslint consistent-return: 0 */
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { getFileContents } from './utils'
import { HELP_MESSAGE, EMPTY_REQUEST, ERROR_MESSAGE } from './constants'

// TODO: still need to pull tokens from teams
const { BS_USERNAME, BS_AUTH_TOKEN, SLACK_VERIFY_TOKEN, PORT } = process.env
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

        const { text } = req.body

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

        getFileContents(text, {
            username: BS_USERNAME,
            token: BS_AUTH_TOKEN
        }, (err, content) => {
            if (err) {
                return res.json({
                    response_type: 'ephemeral',
                    text: `${ ERROR_MESSAGE } ${ err.message }`
                })
            }

            return res.json({
                response_type: 'ephemeral',
                ...content
            })
        })
    })

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server: ', err)
    }

    return console.log('Server successfully started on port %s', PORT)
})
