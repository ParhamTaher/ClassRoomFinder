var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();


var postService = (function() {
  return {
    /*
      Inserts a new post into the posts table
    */
    insertPost: function(payload) {
		// Must connect to a database    
	},
  };
}();

module.exports = postService;