var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var postService = (function() {
  return {
    /*
      Inserts a new post into the posts table
    */
    insertPost: function(payload) {
    	//table, cond, cond_value
    	return queryService.insert('buildings', 'name, address, number_of_classrooms, closing_time', ['Bahen', '6 St George St', 321, 'now()'])
	},
  };
})();

module.exports = postService;