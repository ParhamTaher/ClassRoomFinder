var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var buildingService = (function() {
  return {
    getNearbyBuildings: function(payLoad) {
      /*
      Returns all nearby buildings within this proximity
      */

      // DO NOT IMPLEMENT THIS METHOD
      logger.log(payLoad);
    },
    getAllBuildings: function(payLoad) {
      /*
      Returns all buildings
      */
      return queryService.selectAll('buildings', 'name')
      .then(undefined, function(err){
        logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },

    getBuildingInfo: function(payLoad) {
      /*
      Return available_classrooms, available_labs, img (skip), latest_activity, latest_comment
      */

      var building_id = payLoad.building_id;


      var available_labs = queryService.select_col('COUNT(room_id)', 'classrooms', 'is_lab = \'t\' AND building_id', building_id);
      var latest_activity = queryService.select_complex('end_time', 'bookings', 'building_id');
      var latest_comment = queryService.select_col('message', 'comments', 'importance=\'High\' AND building_id', building_id);

      var result = available_labs + " " + latest_activity + " " + latest_comment;


      return result
      .then(undefined, function(err){
        logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },

    getRoomInfo: function(payLoad) {
      /*
      Return {Bookings: [], Comments: []}
      */

      
      var building_id = payLoad.building_id;
      var room_id = payLoad.room_id;

      var bookings = queryService.select('bookings', 'classroom_id = ' + room_id + ' AND ' + 'building_id', building_id);
      var comments = queryService.select_col('message', 'comments', 'building_id', building_id);

      var result = bookings + " " + comments;

      return result
      .then(undefined, function(err){
        logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },
    createBuilding: function(payLoad) {
      /*
      Creates a building and a schedule
      */
      logger.log(payLoad);
      return queryService.insert('buildings', 'name,address,num_rooms,lat,lon',[payLoad.name, payLoad.address, payLoad.num_rooms, payLoad.lat, payLoad.lon], 'building_id')
      .then(function(result){
        logger.log(result);
        for (var thisDay in payLoad.schedule){
          var time = payLoad.schedule[thisDay].split('-');
            queryService.insert('building_schedule', 'building_id,day,open_time,closing_time', [result.rows[0].building_id, thisDay, time[0], time[1]])
        }
        return result;
      })
      .then(undefined, function(err){
        logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },

    createRoom: function(payLoad) {
        /*
        Creates a room
        */
        logger.log(payLoad);
        return queryService.insert('classrooms', 'building_id,code,occupancy,is_lab',[payLoad.buildingId, payLoad.code, payLoad.occupancy, payLoad.isLab], 'room_id')
        .then(undefined, function(err){
            logger.log("Throwing an error");
        throw new MyError(err.message, __line, 'building-service.js');
      })
    },
  };
})();

module.exports = buildingService;
