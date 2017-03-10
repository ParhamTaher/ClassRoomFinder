/*
  This service file contains all utility functions
*/
var logger = require('tracer').console();
var queryService = require('./db/query-service');
var MyError = require('./error-service').MyError;

var utilService = (function() {
  return {
    generateColumnStr: function(columns) {
      var columnArray = columns.split(/(?:,| )+/);
      var columnString = '';
      for (i = 1; i < columnArray.length + 1; i++) {
        columnString += '$' + i + ', ';
      }
      columnString = columnString.substring(0, columnString.length - 2);
      columnStringArr = [columnString, i];
      return columnStringArr;
    },
    generateColumnVal: function(value, cond_value) {
      values = [];
      value.forEach(function (entry) {
        values.push(entry);
      });
      values.push(cond_value);
      return values;
    }
  };
})();

module.exports = utilService;