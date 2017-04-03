var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var cobaltService  = require('../services/cobalt-service.js');

router.get('/api/v1/cobalt/get_buildings', function(req, res) {
	var payLoad = req.query;
  var result = cobaltService.getBuildings(payLoad);
	res.status(200).json({status: "Success", response: result});
});

router.get('/api/v1/cobalt/get_rooms', function(req, res) {

  var payLoad = req.query;
  return cobaltService.getRooms(payLoad)
  .then(function(result){
  	res.status(200).json({status: "Success", response: result});
  })
  .then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/cobalt/get_schedules', function(req, res) {

  var payLoad = req.query;
  return cobaltService.getSchedules(payLoad)
  .then(function(result){
  	res.status(200).json({status: "Success", response: result});
  })
  .then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

module.exports = router;
