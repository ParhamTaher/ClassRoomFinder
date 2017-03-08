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
		return queryService.insert('buildings', 'string with column headers', []); 
	},
  };
}();

module.exports = postService;