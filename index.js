var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Let us know",
                    "subtitle": "Let us know what is your experience and what is your area of interest to offer the best mentor.",
                    "image_url": "https://dl.dropboxusercontent.com/u/10799605/point1.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://eclubprague.com/esc/sign-up/",
                        "title": "More information"
                    }],
                }, {
                    "title": "Select project",
                    "subtitle": "Visit us in the eClub Scientific Incubator and we will help you to select an interesting problem for summer 2016.",
                    "image_url": "https://dl.dropboxusercontent.com/u/10799605/point2.png",
                    "buttons": [{
                    		"type": "web_url",
                        	"url": "https://eclubprague.com/esc/#proj1",
                        	"title": "More information"
                    
                        
                    }],
                }, {
                    "title": "Work in ESC",
                    "subtitle": "Get scholarship and work on your selected project during the summer 2016 in the eClub Scientific Incubator.",
                    "image_url": "https://dl.dropboxusercontent.com/u/10799605/point3.png",
                    "buttons": [{
                    		"type": "web_url",
                        	"url": "https://eclubprague.com/venue/",
                        	"title": "More information"
                        
                    }],

                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'eClub') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})
var token = "EAAOhG9EcDMMBAMZACLg6JyWoCHKB2K93GYVDgfquDtljnZAMmGfROVfDH3zSV2ajfiBDhIUq8hahupfu1JG6Ln2g9kjewr5SNXpXZA0zA9JZAg2QwRKYTQukZCfspcWkjNjKiy8c2xDl3SxxuS4hYZCcZB01zsrzmg9KF2Fb3Y0LwZDZD"

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})