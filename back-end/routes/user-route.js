var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var userService  = require('../services/user-service.js');

router.get('/api/v1/user/get_user_id', function(req, res) {
	/*
		Takes user cookie, checks if it exists and returns user_id if it
		does, else if creates and returns a new user_id

		Input (headers): None
		Input (body): N/A
		Input (query): cookie
		Output: user_id
	*/
  var payLoad = req.query;
  
	return userService.getId(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", 'user_id': result[0].user_id})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/user/get_favourite_buildings', function(req, res) {
	/*
		Takes a user_id and returns a list of favourite buildings
		Input (headers): user_id 
		Input (body): N/A
		Input (query): None
	*/
  var payLoad = req.headers;
  
	return userService.getFavouriteBuildings(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", result})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/user/add_favourite_building', function(req, res) {
	/*
		Takes a user_id (header) and building_id (body) and creates an entry. 
		Returns the favourite_id on success
		Input (headers): user_id 
		Input (body): building_id
		Input (query): None
	*/

  var payLoad = {
  	"userId": parseInt(req.headers.user_id),
  	"buildingId": req.body.building_id
  }
  logger.log(payLoad);
	return userService.addFavouriteBuilding(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "fav_id": result.rows[0].fav_id})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/user/delete_favourite_building', function(req, res) {
	/*
		Takes a user_id (header) and building_id (body) and deletes the entry. 
		Input (headers): user_id 
		Input (body): building_id
		Input (query): None
	*/
	
  var payLoad = {
  	"userId": parseInt(req.headers.user_id),
  	"buildingId": req.body.building_id

  }
  logger.log(payLoad);
	return userService.deleteFavouriteBuilding(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", result})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/user/create_booking', function(req, res) {
	/*
		Takes a user_id (header) and building_id (body) and  building_id, classroom_id, 
		date, start_time, end_time, title, comment, tag and creates a boooking if free 
		Input (headers): user_id 
		Input (body):  building_id, classroom_id, date, start_time, end_time, title, comment, tag
		Input (query): None
	*/
	
  var payLoad = {
  	"userId": parseInt(req.headers.user_id),
  	"buildingId": req.body.building_id,
  	"room": req.body.room,
  	"date": req.body.date,
  	"start_time": req.body.start_time,
  	"end_time": req.body.end_time,
  	"title": req.body.title,
  	"comment": req.body.comment,
  	"tag": req.body.tags
  }
  logger.log(payLoad);
	return userService.createBooking(payLoad)
	.then(function(result){
		logger.log(result.rows[0])
		res.status(200).json({status: "Success", "booking_id": result.rows[0].booking_id})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/user/delete_booking', function(req, res) {
	/*
		Takes a user_id (header) and booking_id (body) and removes it from db
		Input (headers): user_id 
		Input (body):  booking_id
		Input (query): None
	*/
	
  var payLoad = {
  	"userId": parseInt(req.headers.user_id),
  	"bookingId": req.body.booking_id
  }
  logger.log(payLoad);
	return userService.deleteBooking(payLoad)
	.then(function(result){
		logger.log(result)
		res.status(200).json({status: "Success"})
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

module.exports = router;
