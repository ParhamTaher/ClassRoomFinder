var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var buildingService = (function() {
  return {
    getNearbyBuildings: function(payload) {
    	/*
      Returns all nearby buildings within this proximity
    	*/

    	// DO NOT IMPLEMENT THIS METHOD
    	logger.log(payload);
    },
    getAllBuildings: function(payload) {
    	/*
      Returns all buildings
    	*/
    	return queryService.selectAll('buildings', 'name')
    	.then(undefined, function(err){
    		logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },
    createBuilding: function(payload) {
    	/*
      Creates a building and a schedule
    	*/
    	logger.log(payload);
    	return queryService.insert('buildings', 'name,address,num_rooms,lat,lon',[payload.name, payload.address, payload.num_rooms, payload.lat, payload.lon], 'building_id')
    	.then(function(result){
    		logger.log(result);
    		for (var thisDay in payload.schedule){
    			var time = payload.schedule[thisDay].split('-');
						queryService.insert('building_schedule', 'building_id,day,open_time,closing_time', [result.rows[0].building_id, thisDay, time[0], time[1]])
    		}
    	})
    	.then(undefined, function(err){
    		logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },
  };
})();

module.exports = buildingService;
