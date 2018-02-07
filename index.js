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
    if (userManuallyInputText) {
        var request2 = app.textRequest(userManuallyInputText, {
            sessionId: 'acsdaeaweqweqwe'
        });
        request2.on('response', function(response) {
            console.log(response);
        });

        request2.on('error', function(error) {
            console.log(error);
        });
    }
    res.sendStatus(200)

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => console.log('App started!'));