var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var userService = (function() {
  return {
    /*
      Inserts a new post into the posts table
    */
    getId: function(payload) {
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
      .catch(function(err){
        throw err;
      })
    },
  };
})();

module.exports = userService;
