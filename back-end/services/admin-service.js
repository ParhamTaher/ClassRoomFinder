var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');
var MyError = require('./error-service.js');

var adminService = (function() {
  return {
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
            throw new MyError(err.message, __line, 'error-service.js');
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
          throw new MyError(err.message, __line, 'error-service.js');
      })
    },
    createRoomSchedule: function(payLoad) {
        /*
        Creates the appended schedules for this room
        */
        logger.log(payLoad);
        var promiseArray = [];
        //for (var timeSlot in payLoad.schedule){
        for (var i = 0; i < payLoad.schedule.length; i++){
          logger.log(i);
          logger.log(payLoad.schedule[i]);
          promiseArray.push(queryService.insert('schedules', 'classroom_id,building_id,activity,start_time,end_time,weekday', [payLoad.room_id, payLoad.building_id, payLoad.schedule[i].activity, payLoad.schedule[i].start_time, payLoad.schedule[i].end_time, payLoad.schedule[i].day], 'schedule_id'));
        }
        return Promise.all(promiseArray)
        .then(undefined, function(err){
          throw new MyError(err.message, __line, 'user-service.js');
        })
    },
    addBuildingHours: function(payLoad) {
      /*
      Add these hours to this building's schedule
      */
      logger.log(payLoad)
      logger.log(Object.keys(payLoad.schedule).length)
      var promiseArray = [];
      for (var day in payLoad.schedule){
        var times = payLoad.schedule[day].split('-')
        logger.log(times)
        promiseArray.push(queryService.insert('building_hours', 'building_id,day,open_time,closing_time', [payLoad.building_id, day, times[0], times[1]], 'schedule_id'));
      }
      return Promise.all(promiseArray)
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    }
  };
})();

module.exports = adminService;
