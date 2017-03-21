var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var buildingService  = require('../services/building-service.js');

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
		res.status(200).json({status: "Success", response: result});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});
module.exports = router;
