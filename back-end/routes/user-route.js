var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var userService  = require('../services/user-service.js');

router.get('/api/v1/user/get_user_id', function(req, res) {

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

module.exports = router;
