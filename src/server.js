import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN
if (!VERIFY_TOKEN) {
    console.error('SLACK_VERIFY_TOKEN is required')
    process.exit(1)
}
const PORT = process.env.PORT
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
        if (req.body.token !== VERIFY_TOKEN) {
            return res.sendStatus(401)
        }

        let message = 'boopbeep'

        // Handle any help requests
        if (req.body.text === 'help') {
            message = "Sorry, I can't offer much help, just here to beep and boop"
        }

        return res.json({
            response_type: 'ephemeral',
            text: message
        })
    })

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server: ', err)
    }

    return console.log('Server successfully started on port %s', PORT)
})
