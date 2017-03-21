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
    	queryService.insert('buildings', 'name, address, number_of_classrooms, closing_time', ['Institute of Biomaterials and Biomedical', '164 College Street', 500, 'now()'])
    	queryService.insert('buildings', 'name, address, number_of_classrooms, closing_time', ['Annesley Hall', '95 Queens Park', 30, 'now()'])
    	queryService.insert('buildings', 'name, address, number_of_classrooms, closing_time', ['Anthropology Building', '19 Rusell Street', 50, 'now()'])
	return queryService.insert('buildings', 'name, address, number_of_classrooms, closing_time', ['Bahen', '6 St George St', 321, 'now()'])
    },
  };
})();

module.exports = postService;
