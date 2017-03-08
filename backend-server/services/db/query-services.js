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
          if (result.rowCount === 0) {
            throw new Error('Postgres error: 0 rows were selected.');
          } else {
            logger.log(result);
            return result.rows;
          }
        });
    },

    /* ================ INSERT ================ */

    /*
      To use this function call insert(table_name, 'string with column headers', [array of objects])
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
          if (result.rowCount === 0) {
            throw new Error('Postgres error: 0 rows were inserted.');
          } else {
            logger.log(result);
            return result;
          }
        });
    },

    /* ================ UPDATE ================ */

    update: function(table, column, value, cond, cond_value) {
      var columnString = utilService.generateColumnStr(column);
      var text = 'UPDATE ' + table + ' SET (' + column + ') = (' + columnString[0] + ') WHERE ' + cond + ' = ($' + columnString[1] + ')';
      logger.log('DB text query', text);
      var values = utilService.generateColumnVal(value, cond_value);
      logger.log('DB values', values);
      return dbService.query(text, values)
        .then(function(result) {
          if (result.rowCount === 0) {
            throw new Error('Postgres error: 0 rows were updated.');
          } else {
            logger.log(result);
            return result;
          }
        });
    },

}();

module.exports = queryService;