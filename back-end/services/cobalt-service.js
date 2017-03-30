var express = require('express');
var https = require('https');
var fs = require('fs');
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
          var roomToSize = []
          var meeting = null;
          var sections = null;
          for (var i = 0; i < profiles.length; i++){
            //logger.log(profiles[i])
            sections = profiles[i].meeting_sections
            for (var j = 0; j < sections.length; j++){
              meeting = sections[j].times
              for (var k = 0; k < meeting.length; k++){
                if (meeting[k].location != ''){
                  var tup = [meeting[k].location, sections[0].size]
                  roomToSize.push(tup)
                }
              }
            }
          }
          var promiseArray = [];
          for (var i = 0; i < roomToSize.length; i++){
            var current = roomToSize[i]
            if (current[0].substring(0, 2) == payLoad.building ){
              promiseArray.push(queryService.insert('classrooms', 'code,occupancy,is_lab', [current[1],current[0],'false']))

            }
          }
          Promise.all(promiseArray);
        })

        res.on('error', function(e){
          console.log("Got error" + e.message)
        }) 
      })
    },
  };
})();

module.exports = cobaltService;
