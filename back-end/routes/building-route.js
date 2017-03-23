var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
//var userService  = require('../services/building-service.js');
var queryService = require('../services/db/query-service.js');
var buildingService = require('../services/building-service.js');

router.get('/api/v1/building/get_nearby_buildings', function(req, res) {

  	var payLoad = req.query;
  
	return buildingService.getNearbyBuildings(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_building_info', function(req, res) {

  	//var payLoad = req.query;
  	var building_id = req.query.building_id;

  	//var available_labs = queryService.select('classrooms', 'is_lab = \'t\' AND building_id', building_id);
  	var available_labs = queryService.select_col('COUNT(room_id)', 'classrooms', 'is_lab = \'t\' AND building_id', building_id);

	var latest_activity = queryService.select_complex('end_time', 'bookings', 'building_id');

	//var latest_comment = queryService.select('comments', 'importance=\'High\' AND building_id', building_id);
	var latest_comment = queryService.select_col('message', 'comments', 'importance=\'High\' AND building_id', building_id);

	var payLoad = available_labs + " " + latest_activity + " " + latest_comment;
  	
  	//res.send(payLoad);

	return buildingService.getBuildingInfo(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_room_info', function(req, res) {

  var payLoad = req.query;

	var building_id = req.query.building_id;
	var room_id = req.query.room_id;

	var bookings = queryService.select('bookings', 'classroom_id = ' + room_id + ' AND ' + 'building_id', building_id);
	var comments = queryService.select_col('message', 'comments', 'building_id', building_id);
  
	return buildingService.getRoomInfo(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

module.exports = router;