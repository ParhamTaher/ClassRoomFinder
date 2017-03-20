/*
  This service file builds all the queries sent to Postgres database.
*/
var logger = require('tracer').console();
var dbService = require('./db-service');
var utilService = require('../util-service');
var schedule = require('node-schedule');

var queryService = (function() {
  return {

    /* ================ SELECT ================ */
    select: function(table, cond, cond_value) {
      var text = 'SELECT * FROM ' + table + ' WHERE ' + cond + '= $1';
      var values = [cond_value];
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log(result.rowCount);
          return result.rows;
        });
    },

    /* ================ INSERT ================ */

    /*
      To use this function call insert(table_name, 'string with column headers', [array of objects])
      Eg. Insert('user_context', 'user_id, context_name, context_payload', [userId, context, {}])
    */
    insert: function(table, column, value, return_col) {
      var columnString = utilService.generateColumnStr(column);
      var text = 'INSERT INTO ' + table + ' (' + column + ') VALUES (' + columnString[0] + ')';
      if (return_col) {
        text = text + ' RETURNING ' + return_col;
      }
      var values = value;
      logger.log('query:', text);
      logger.log(value)
      return dbService.query(text, values)
        .then(function(result) {
          console.log(result);
          return result;
        });
    }
  };
})();

module.exports = queryService;