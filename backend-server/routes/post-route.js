var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
var postService  = require('../services/post-services.js');

router.post('/api/v1/post/submit_post', function(req, res) {

  var payLoad = req.body
  
  	return postService.insert(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result})
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	});
});




module.exports = router;