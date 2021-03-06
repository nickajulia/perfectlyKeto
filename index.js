const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const redis = require("redis");
var async = require('async');
var HashMap = require('hashmap');

const client = redis.createClient(process.env.REDIS_URL);
///DIALOG FLOW INIT
let apiai = require('apiai');
let apiApp = apiai(process.env.ACCESS_TOKEN_APIAI);

const app = express();
///END DIALOG FLOW
var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('1d9kwRJ9llkJ2mkHPGNgJbSjJUOL1MXL8rNX9o8YthPQ');
var sheet;

async.series([
    function setAuth(step) {

        var creds_json = {
            client_email: process.env.CLIENT_EMAIL_G_SHEETS,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        }

        doc.useServiceAccountAuth(creds_json, step);
    },
    // function getInfoAndWorksheets(step) {
    //     doc.getInfo(function(err, info) {
    //         console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
    //         sheet = info.worksheets[0];
    //         console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
    //         step();
    //     });
    // },

]);

var map = new HashMap();

app.get('/', (req, res) => {
    doc.getRows(1, {}, function(err, rows) {
        //console.log('Read ' + rows + ' rows');
        if (rows) {
            map.clear();
            for (let i = 0; i < rows.length; i++) {
                map.set(rows[i]['mealtype'], rows[i]['partofdiet']);
            }
        }

    })
    res.send('Updated!');
});
 

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
            //change this to accomodate changes..

            
            if (result && response.status && response.status.errorType == 'success' && result.metadata && result.fulfillment) {
                //food
                if (result.fulfillment.speech != '') {
                    res.json({
                        "messages": [
                            { "text": result.fulfillment.speech },
                        ]
                    });
                }  else {
                    res.json({
                        "redirect_to_blocks": ["Df fallback empty string"]
                    });
                }

            } else {
                res.json({
                    "redirect_to_blocks": ["Df fallback empty string"]
                });
            }
            
        });

        request2.on('error', function(error) {
            console.log(error);
            res.sendStatus({
                "redirect_to_blocks": ["Not sure"]
            })

        });
        request2.end();

    }

});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => console.log('App started!'));