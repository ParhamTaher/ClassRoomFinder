var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var userService = (function() {
  return {
    getId: function(payLoad) {
      /*
      Takes a cookie in the Json payload and returns the user_id if it exists
      Or returns a newly created one
      */

    	logger.log(payLoad);
      return queryService.select('users', 'cookie', payLoad.cookie)
      .then(function(result){
        logger.log(result);
        if (result.length > 0){
          return result;
        } else {
          return queryService.insert('users', 'cookie', [payLoad.cookie], 'user_id')    
        }
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    getFavouriteBuildings: function(payLoad) {
      /*
      Takes a user_id and returns a list of favourite buildings
      */

      logger.log(payLoad);
      return queryService.select('favourites', 'user_id', payLoad.user_id)
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    addFavouriteBuilding: function(payLoad) {
      /*
      Takes a userId and buildingId and returns a list of favourite buildings
      */

      logger.log(payLoad);
      return queryService.insert('favourites', 'user_id,building_id', [payLoad.userId, payLoad.buildingId])
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    deleteFavouriteBuilding: function(payLoad) {
      /*
      Takes a userId and buildingId and deletes from favourites
      */

      logger.log(payLoad);
      return queryService.delete('favourites', 'user_id', payLoad.userId, 'building_id', payLoad.building_id)
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    createBooking: function(payLoad) {
      /*
      Takes tons of information and creates a booking
      */

      logger.log(payLoad);
      /*return queryService.delete('favourites', 'user_id', payLoad.userId, 'building_id', payLoad.building_id)
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })*/
    },
  };
})();

module.exports = userService;
