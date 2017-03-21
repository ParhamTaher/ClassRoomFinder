var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var userService = (function() {
  return {
    getId: function(payload) {
      /*
      Takes a cookie in the Json payload and returns the user_id if it exists
      Or returns a newly created one
      */

    	logger.log(payload);
      return queryService.select('users', 'cookie', payload.cookie)
      .then(function(result){
        logger.log(result);
        if (result.length > 0){
          return result;
        } else {
          return queryService.insert('users', 'cookie', [payload.cookie], 'user_id')    
        }
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    getFavouriteBuildings: function(payload) {
      /*
      Takes a user_id and returns a list of favourite buildings
      */

      logger.log(payload);
      return queryService.select('favourites', 'user_id', payload.user_id)
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
  };
})();

module.exports = userService;
