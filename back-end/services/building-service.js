var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var moment = require('moment');
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
      Return {Available/Available Soon/Unavailable: room_id, code}, comments, bookings, hours
      */

    },

    getRoomInfo: function(payLoad) {
      /*
      Return {Bookings: [], Schedule: []}
      */
      var schedulesAndBookings = {}
      logger.log(payLoad)
      return this.getRoomSchedule(payLoad)
      .then(function(schedule){
        schedulesAndBookings["schedule"] = schedule;
        logger.log(schedule)
        return queryService.select('bookings', 'classroom_id', payLoad.roomId)
      })
      .then(function(bookings){
        logger.log(bookings)
        schedulesAndBookings["bookings"] = bookings;
        return schedulesAndBookings;
      })
      .then(undefined, function(err){
        logger.log(err.message);
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
    getRoomSchedule: function(payLoad){
        /*
          Returns the schedule associated with this room on this date
        */
        logger.log(payLoad)
        var day = moment().format('dddd')
        logger.log(day)

        return queryService.selectTwoConds('schedules', ['weekday', 'classroom_id'], [day, payLoad.roomId], 'start_time')
    },
    getBuildingSchedule: function(payLoad){
        /*
          Returns the schedule associated with this room on this date
        */
        logger.log(payLoad)
        var day = moment().format('dddd')
        logger.log(day)

        return queryService.selectTwoConds('schedules', ['weekday', 'building_id'], [day, payLoad.buildingId], 'schedule_id')
    },
    getBuildingHours: function(payLoad){
        /*
          Returns JSON of building hours for each day
        */
        logger.log(payLoad)
        return queryService.select('building_hours', 'building_id', payLoad.building_id)
        .then(function(result){
          var schedule = {};
          for (var i = 0; i < result.length; i++){
            schedule[result[i].day] = [result[i].open_time, result[i].closing_time]
          }
          return schedule;
        })
    },
    getBuildingComments: function(payLoad){
      /*
        Returns all comments for this building
      */
      logger.log(payLoad)
      return queryService.select('comments', 'building_id', payLoad.building_id)
    }
  };
})();

module.exports = buildingService;
