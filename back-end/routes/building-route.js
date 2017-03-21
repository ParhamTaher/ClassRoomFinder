var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var userService  = require('../services/building-service.js');

router.get('/api/v1/building/get_nearby_id', function(req, res) {

  var payLoad = req.query;
  
	return userService.getId(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
  .catch(function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

module.exports = router;
