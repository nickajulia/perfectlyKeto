const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
const app = express();

app.get('/', (req, res) => res.send('Hello World!'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => console.log('App started!'))