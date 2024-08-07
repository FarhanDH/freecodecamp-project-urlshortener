require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { db } = require('./db/db');
const router = require('./routes/url.route');

// Basic Configuration
const port = process.env.PORT || 3000;
const uri = db;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// route
app.use('/', router);

const listener = app.listen(3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app