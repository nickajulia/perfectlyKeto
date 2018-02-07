const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
///DIALOG FLOW INIT
var apiai = require('apiai');
var app = apiai(process.env.ACCESS_TOKEN_APIAI);


///END DIALOG FLOW



const app = express();




app.get('/', (req, res) => res.send('Hello World!'));
app.get('/webhook', (req, res) => {
    console.log(req);

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => console.log('App started!'));