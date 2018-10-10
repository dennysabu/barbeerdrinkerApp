var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', require('./api'));

// start express server for backend api
app.listen('3000', () => {
    console.log('Server started on port 3000');
});

// api
app.get('/', (req, res) => {
  res.send('Api running...')
});

module.exports = app;
