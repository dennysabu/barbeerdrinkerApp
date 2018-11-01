var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

// app 
var app = express();

app.use(bodyParser.json({ type: 'application/json' })); // Enables json parsing
app.use('/api', require('./api')); // supplies api entry endpoint
app.use(cors()); // disables cors

// Disables access control for URLs (allows any url)
app.use('*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.header('Access-Control-Allow-Credentials', true);
next();
});

app.options('*', cors());

// start express server on port 5000
app.listen('5000', () => {
    console.log('Server started on port 5000');
});

// api
app.get('/', (req, res) => {
  res.send('Api running...')
});

// routes app
module.exports = app;
