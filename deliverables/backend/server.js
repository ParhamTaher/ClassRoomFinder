var logger = require('tracer').console(); 
var http = require('http'); 
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');


var postRoutes = require('./routes/post-route');

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// Process application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user_token");
  next(); 
});

// Route definitions
app.post('/api/v1/post/submit_post', postRoutes);

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
});