var express = require('express');
var https = require('https');
var fs = require('fs');
var moment = require('moment')
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');
var MyError = require('./error-service.js');

var cobaltService = (function() {
  return {
    getBuildings: function(payLoad) {
      var url = 'https://cobalt.qas.im/api/1.0/buildings?limit=100&key=' + process.env.COBALT_KEY;
      logger.log(url)
      https.get(url, function(res){
        var body = "";
        var profile = {}
        logger.log("Got response: " + res.statusCode);
        if (res.statusCode == 200) {
            console.log("Status " + res.statusMessage)
        }

        res.on('data', function(chunk){
          body += chunk;
        });

        res.on('end', function(){
          profiles = JSON.parse(body);
          var entriesArray = [];
          for (var i = 0; i < profiles.length; i++){
            var name = profiles[i].name + " " + profiles[i].code;
            var code = profiles[i].code;
            var add = profiles[i].address;
            var address = add.street + "," + add.city + "," + add.province + "," + add.country + "," + add.postal;
            var lat = profiles[i].lat;
            var lon = profiles[i].lng;
            var num_rooms = 350;
            entriesArray.push([name, code, address, num_rooms, lat, lon])
          }
          var promiseArray = [];
          for (var i = payLoad.start; i < payLoad.end; i++){
            logger.log(entriesArray[i])
            promiseArray.push(queryService.insert('buildings', 'name,code,address,num_rooms,lat,lon', entriesArray[i], 'building_id'));
          }
          Promise.all(promiseArray);
        })

        res.on('error', function(e){
          console.log("Got error" + e.message)
        }) 
      })
    },
    getRooms: function(payLoad) {
      var url = 'https://cobalt.qas.im/api/1.0/courses?limit=100&key=' + process.env.COBALT_KEY;
      logger.log(url)
      https.get(url, function(res){
        var body = "";
        var profile = {};
        logger.log("Got response: " + res.statusCode);
        if (res.statusCode == 200) {
            console.log("Status " + res.statusMessage)
        }

        res.on('data', function(chunk){
          body += chunk;
        });

        res.on('end', function(){
          profiles = JSON.parse(body);
          var roomToSize = {}
          var meeting = null;
          var sections = null;
          
          // Loop through result and get a list of all rooms and size
          for (var i = 0; i < profiles.length; i++){
            sections = profiles[i].meeting_sections
            for (var j = 0; j < sections.length; j++){
              meeting = sections[j].times
              for (var k = 0; k < meeting.length; k++){
                if (meeting[k].location.substring(0, 2) == payLoad.building){
                  if (!roomToSize.hasOwnProperty(meeting[k].location.toString()))
                    roomToSize[meeting[k].location] = sections[0].size
                  else if (roomToSize[meeting[k].location] < sections[0].size){
                    roomToSize[meeting[k].location] = sections[0].size
                  }
                }
              }
            }
          }
          logger.log(roomToSize)
          return queryService.select('buildings', 'buildings.code', payLoad.building)
          .then(function(result){
            logger.log(result[0].building_id)
            var promiseArray = [];
            for (var room in roomToSize){
              logger.log(room)
              promiseArray.push(queryService.insert('classrooms', 'building_id,code,occupancy,is_lab', [result[0].building_id, room, roomToSize[room],'false']))
            }
            return Promise.all(promiseArray)
            .then(function(result){
              return result;
            })
          })
        })

        res.on('error', function(e){
          console.log("Got error" + e.message)
        }) 
      })
    },
    getSchedules: function(payLoad) {
      var url = 'https://cobalt.qas.im/api/1.0/courses?limit=100&key=' + process.env.COBALT_KEY;
      logger.log(url)
      https.get(url, function(res){
        var body = "";
        var profile = {};
        logger.log("Got response: " + res.statusCode);
        if (res.statusCode == 200) {
            console.log("Status " + res.statusMessage)
        }

        res.on('data', function(chunk){
          body += chunk;
        });

        res.on('end', function(){
          profiles = JSON.parse(body);
          var roomToSize = []
          var meeting = null;
          var sections = null;
          
          // Loop through result and get a list of all rooms and size
          for (var i = 0; i < profiles.length; i++){
            sections = profiles[i].meeting_sections
            for (var j = 0; j < sections.length; j++){
              meeting = sections[j].times
              for (var k = 0; k < meeting.length; k++){
                if (meeting[k].location.substring(0, 2) == payLoad.building){
                  var day = meeting[k].day.substring(0,1) + meeting[k].day.substring(1).toLowerCase()
                  var start = meeting[k].start / 3600 
                  start = start + ':00:00'
                  var end = meeting[k].end / 3600
                  end = end + ':00:00'
                  var code = profiles[i].code.substring(0,6) + ' ' + sections[j].code
                  roomToSize.push([meeting[k].location, code, start, end, day])
                }
              }
            }
          }
          logger.log(roomToSize.length)
          return queryService.select('buildings', 'buildings.code', payLoad.building)
          .then(function(result){
            var promiseArray = [];
            for (var i = 0; i < 5; i++){
              var room = roomToSize[i]
              logger.log(room)
              promiseArray.push(queryService.selectThenInsert('schedules', 'building_id, activity, start_time, end_time, weekday, classroom_id', [result[0].building_id, room[1], room[2], room[3], room[4]], ['room_id', 'classrooms', 'code', room[0].toString()], 'schedule_id'))
            }
            return Promise.all(promiseArray)
            .then(function(result){
              return result;
            })
          })
        })

        res.on('error', function(e){
          console.log("Got error" + e.message)
        }) 
      })
    },
  };
})();

module.exports = cobaltService;
