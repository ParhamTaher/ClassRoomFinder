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
  var result = cobaltService.getRooms(payLoad);
	res.status(200).json({status: "Success", response: result});
});


module.exports = router;
