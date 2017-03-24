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
    select: function(table, cond, cond_value, order_by) {
      var text = 'SELECT * FROM ' + table + ' WHERE ' + cond + '= $1';
      var values = [cond_value];
      if (order_by){
        text = text + ' ORDER_BY + ' + order_by;
      }
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log(result.rowCount);
          return result.rows;
        });
    },
    selectAll: function(table, orderBy) {
      var text = 'SELECT * FROM ' + table + ' ORDER BY ' + orderBy;
      logger.log(text);
      return dbService.query(text)
        .then(function(result) {
          logger.log(result.rowCount);
          return result.rows;
        });
    },
    selectTwoConds: function(table, conds, cond_values) {
      logger.log(cond_values)
      var text = 'SELECT * FROM ' + table + ' WHERE )' + conds[0] + '= $1' + ' AND ' + conds[1] + '= $2)';
      var values = cond_values;
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log("Number of rows found: ", result.rowCount);
          logger.log('Query result: ', result.rows);
          return result.rows;
        });
    },
      selectDate: function(table, conds, cond_values, order_by) {
      logger.log(cond_values)
      var text = 'SELECT * FROM ' + table + ' WHERE ' + conds[0] + ' >= $1' + ' AND ' + conds[1] + ' < $2';
      var values = cond_values;
      if (order_by){
        text = text + ' ORDER_BY ' + order_by;
      }
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log("Number of rows found: ", result.rowCount);
          logger.log('Query result: ', result.rows);
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
    },

    /* ================ DELETE ================ */

    delete: function(table, cond, cond_value, cond2, cond2_value) {
      var text = 'DELETE FROM ' + table + ' WHERE ' + cond + '= $1';
      var values = [cond_value];
      if (cond2 && cond2_value) {
        text = text + ' AND ' + cond2 + '= $2';
        values.push(cond2_value);
      }
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log(result);
          return result;
        });
    }
  };
})();

module.exports = queryService;