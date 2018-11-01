var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', require('./api'));
app.use(cors());
app.use('*', function(req, res, next) {
//replace localhost:8080 to the ip address:port of your server
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.header('Access-Control-Allow-Credentials', true);
next();
});

//enable pre-flight
app.options('*', cors());

// start express server for backend api
app.listen('5000', () => {
    console.log('Server started on port 5000');
});

// api
app.get('/', (req, res) => {
  res.send('Api running...')
});

module.exports = app;
