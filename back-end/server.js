var logger = require('tracer').console(); 
var http = require('http'); 
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');


var userRoutes = require('./routes/user-route');
var buildingRoutes = require('./routes/building-route');

//connect to db
var queryService = require('./services/db/query-service');

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

//ANGELA's STUFF
//get building info

/*
- get_building_info()
GET
Input (headers): None 
Input (body): N/A
Input (query): building_id
Output: available_classrooms, available_labs, img, latest_activity, latest_comment
*/

app.get('/api/v1/building/get_building_info', function (req, res) {
	var building_id = req.query.building_id;



	var available_classrooms = queryService.select('classrooms', 'building_id', building_id);
	
	var available_labs = queryService.select('classrooms', 'is_lab = \'t\' AND building_id', building_id);

	var latest_activity = queryService.select_complex('end_time', 'bookings', 'building_id');

	var latest_comment = queryService.select('comments', 'importance=\'High\' AND building_id', building_id);


	//res.send



});


//get room info
/*
- get_room_info()
GET
Input (headers): None
Input (body): N/A
Input (query): building_id, room_id
Output: {Bookings: [], Comments: []}
*/

app.get('/api/v1/building/get_room_info', function (req, res) {
	var building_id = req.query.building_id;
	var room_id = req.query.room_id;

	var bookings = queryService.select('bookings', 'classroom_id = ' + room_id + ' AND ' + 'building_id', building_id);
	var comments = queryService.select_col('message', 'comments', 'building_id', building_id);


	//res.send(comments);

	//res.send(req.params);

});

// Route definitions
app.get('/api/v1/user/get_user_id', userRoutes);
app.get('/api/v1/user/get_favourite_buildings', userRoutes);
app.post('/api/v1/user/add_favourite_buildings', userRoutes);
app.post('/api/v1/user/delete_favourite_buildings', userRoutes);
app.post('/api/v1/user/book_event', buildingRoutes);
app.post('/api/v1/user/delete_event', buildingRoutes);

app.get('/api/v1/building/get_nearby_buildings', buildingRoutes);
app.get('/api/v1/building/get_all_buildings', buildingRoutes);
//app.get('/api/v1/building/get_building_info', buildingRoutes);
app.get('/api/v1/building/get_building_comments', buildingRoutes);
app.get('/api/v1/building/get_building_labs', buildingRoutes);
//app.get('/api/v1/building/get_room_info', buildingRoutes);
app.get('/api/v1/building/get_building_schedule', buildingRoutes);

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
});