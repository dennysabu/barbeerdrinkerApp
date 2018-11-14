var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

// app
var app = express();

app.options('*', cors());
app.use(cors());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use(bodyParser.json({ type: 'application/json' })); // Enables json parsing
app.use('/api', require('./api')); // supplies api entry endpoint

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
