var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var buildingService = (function() {
  return {
    /*
      Inserts a new post into the posts table
    */
    getNearbyBuildings: function(payload) {
    	logger.log(payload);
    },

    getBuildingInfo: function(payload) {
    	logger.log(payload);
    },

    getRoomInfo: function(payload) {
    	logger.log(payload);
    },
  };
})();

module.exports = buildingService;
