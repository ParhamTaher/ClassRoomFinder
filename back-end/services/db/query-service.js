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
    selectNearby: function(table, conds, cond_values) {
      logger.log(cond_values)
      var text = 'SELECT * FROM ' + table + ' WHERE (lat > $1 AND lat < $2 AND lon < $3 AND lon > $4)';
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
    selectTwoConds: function(table, conds, cond_values) {
      logger.log(cond_values)
      var text = 'SELECT * FROM ' + table + ' WHERE (' + conds[0] + '= $1' + ' AND ' + conds[1] + '= $2)';
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
    selectAndJoin: function(building_id, day, time) {
      logger.log(building_id, day, time)
      var values = [building_id, day, time]
      var text = 'SELECT * FROM (schedules INNER JOIN classrooms ON schedules.classroom_id = classrooms.room_id) WHERE (classrooms.building_id = $1 AND schedules.weekday = $2 AND schedules.end_time >= $3) ORDER BY room_id, start_time' 
      logger.log(text);
      logger.log(values);
      return dbService.query(text, values)
        .then(function(result) {
          logger.log("Number of rows found: ", result.rowCount);
          logger.log('Query result: ', result.rows);
          return result.rows;
        });
    },
    selectJoinGeneral: function(table_one, table_two, table_one_on, table_two_on, cond, values, order_by) {
      logger.log(table_one, table_two, table_one_on, table_two_on, cond, values, order_by)
      var text = 'SELECT * FROM (' + table_one + ' INNER JOIN ' + table_two + ' ON ' + table_one + '.' + table_one_on + ' ='  + table_two + '.' + table_two_on + ') WHERE (' + cond + ' = $1)'
      if (order_by){
        text = text + ' ORDER BY '+ order_by
      }
      logger.log(text);
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
    /*
      To use this function call insertOnConflict(table_name, 'string with column headers', [array of objects], return_col)
      Eg. Insert('user_context', 'user_id, context_name, context_payload', [userId, context, {}], returning_value)
    */
    insertOnConflict: function(table, column, value, return_col){
      var columnString = utilService.generateColumnStr(column);
      var text = 'INSERT INTO ' + table + ' (' + column + ') VALUES (' + columnString[0] + ') ON CONFLICT DO NOTHING';
      if (return_col){
          text = text + ' RETURNING ' + return_col;
      }
      logger.log(text, value, return_col);
      var values = value;
      //logger.log('query:', text);
      //logger.log(value)
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