var logger = require('tracer').console(); 
var http = require('http'); 
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');


var userRoutes = require('./routes/user-route');
var buildingRoutes = require('./routes/building-route');

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// Process application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user_token");
  next(); 
});

// Route definitions
app.get('/api/v1/user/get_user_id', userRoutes);
app.get('/api/v1/user/get_favourite_buildings', userRoutes);
app.post('/api/v1/user/add_favourite_building', userRoutes);
app.post('/api/v1/user/delete_favourite_building', userRoutes);
app.post('/api/v1/user/create_booking', userRoutes);
app.post('/api/v1/user/delete_booking', userRoutes);

app.get('/api/v1/building/get_nearby_buildings', buildingRoutes);
app.get('/api/v1/building/get_all_buildings', buildingRoutes);
app.get('/api/v1/building/get_building_info', buildingRoutes);
app.get('/api/v1/building/get_building_comments', buildingRoutes);
app.get('/api/v1/building/get_building_labs', buildingRoutes);
app.get('/api/v1/building/get_room_info', buildingRoutes);
app.get('/api/v1/building/get_building_hours', buildingRoutes);
app.get('/api/v1/building/get_room_schedule', buildingRoutes);
app.get('/api/v1/building/get_building_schedule', buildingRoutes);
app.post('/api/v1/building/create_building', buildingRoutes);
app.post('/api/v1/building/add_room', buildingRoutes);

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
});