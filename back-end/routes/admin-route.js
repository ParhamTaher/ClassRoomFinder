var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var adminService  = require('../services/admin-service.js');

router.post('/api/v1/admin/create_building', function(req, res) {
	/*
		Returns a building id if added else 0

		Input (headers): None
		Input (body): name, address, num_classrooms, closing_time, lat, lon
		Input (query): None
		Output: building id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return adminService.createBuilding(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "building_id": result.rows[0].building_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/admin/add_room', function(req, res) {
	/*
		Returns a room id if added else 0

		Input (headers): None
		Input (body): building_id, code, occupancy, is_lab
		Input (query): None
		Output: room id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return adminService.createRoom(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "room_id": result.rows[0].room_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/admin/add_room_schedule', function(req, res) {
	/*
		Returns an array ofschedule ids on success

		Input (headers): None
		Input (body): building_id, room_id, bookings: [{activity, start_time, end_time}]
		Input (query): None
		Output: rooo id on success
	*/

	var payLoad = req.body;
	try {
		return adminService.createRoomSchedule(payLoad)
		.then(function(result){
	    logger.log(result);
			res.status(200).json({status: "Success"});
		})
	} catch (err) {
		res.status(500).json({status: "Failure", response: err});
	}
});

module.exports = router;
