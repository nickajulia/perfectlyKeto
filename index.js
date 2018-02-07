const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
///DIALOG FLOW INIT
let apiai = require('apiai');
let apiApp = apiai(process.env.ACCESS_TOKEN_APIAI);


///END DIALOG FLOW



const app = express();




app.get('/', (req, res) => res.send('Hello World!'));
app.get('/webhook', (req, res) => {
    let userManuallyInputText = req.query['last user freeform input'];
    let messengerId = req.query['messenger user id'];
    if (userManuallyInputText) {
        var request2 = apiApp.textRequest(userManuallyInputText, {
            sessionId: messengerId
        });
        request2.on('response', function(response) {
            console.log(response);
        });

        request2.on('error', function(error) {
            console.log(error);
        });
        request2.end();

    }
    res.sendStatus(200)

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => console.log('App started!'));