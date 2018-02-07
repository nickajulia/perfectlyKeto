const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
///DIALOG FLOW INIT
let apiai = require('apiai');
let apiApp = apiai(process.env.ACCESS_TOKEN_APIAI);


///END DIALOG FLOW
var doc = new GoogleSpreadsheet('1d9kwRJ9llkJ2mkHPGNgJbSjJUOL1MXL8rNX9o8YthPQ');
async.series([
    function setAuth(step) {

        var creds_json = {
            client_email: process.env.CLIENT_EMAIL_G_SHEETS,
            private_key: process.env.PRIVATE_KEY_G_SHEETS
        }

        doc.useServiceAccountAuth(creds_json, step);
    }
]);

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
            let result = response.result;
            if (result && response.status && response.status.errorType == 'success' && result.metadata && result.metadata.intentName.includes('food')) {
                //food
                console.log('FOOD <3')
            } else {
                //not food
                console.log('not FOOD <3')
            }
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