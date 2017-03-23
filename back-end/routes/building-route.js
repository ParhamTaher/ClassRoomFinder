var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
//var userService  = require('../services/building-service.js');
var queryService = require('../services/db/query-service.js');
var buildingService = require('../services/building-service.js');

router.get('/api/v1/building/get_nearby_buildings', function(req, res) {
	/*
		Takes a geo-location (lat and lon), and distance, and returns all buildings
		within that proximity

		Input (headers): None
		Input (body): N/A
		Input (query): lat, lon
		Output: Ordered list of buildings by location
	*/
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

router.get('/api/v1/building/get_all_buildings', function(req, res) {
	/*
		Returns an ordered list of all buildings

		Input (headers): None
		Input (body): N/A
		Input (query): None
		Output: Ordered list of buildings
	*/
  
	return buildingService.getAllBuildings()
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/building/create_building', function(req, res) {
	/*
		Returns a building id if added else 0

		Input (headers): None
		Input (body): name, address, num_classrooms, closing_time, lat, lon
		Input (query): None
		Output: building id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return buildingService.createBuilding(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "building_id": result.rows[0].building_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/building/add_room', function(req, res) {
	/*
		Returns a room id if added else 0

		Input (headers): None
		Input (body): building_id, code, occupancy, is_lab
		Input (query): None
		Output: rooo id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return buildingService.createRoom(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "room_id": result.rows[0].room_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

//----------------------ANGELA's CODE-----------------------------


router.get('/api/v1/building/get_building_info', function(req, res) {

  	/*
  	- get_building_info()
	GET
	Input (headers): None 
	Input (body): N/A
	Input (query): building_id
	Output: available_classrooms, available_labs, img, latest_activity, latest_comment

	*/
  	
  	var payLoad = req.query;

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

	/*
	- get_room_info()
	GET
	Input (headers): None
	Input (body): N/A
	Input (query): building_id, room_id
	Output: {Bookings: [], Comments: []}

	*/

  	var payLoad = req.query;
  
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