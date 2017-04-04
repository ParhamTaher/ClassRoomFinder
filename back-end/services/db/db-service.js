/*
This service file connects and queries the Postgres Database
*/
var logger = require('tracer').console();
var pg = require('pg');
var url = require('url');
var Pool = pg.Pool;
var Promise = require('bluebird');
var conString = process.env.DB_CONN;
var promisePG = Promise.promisifyAll(pg);

var create_pool = function() {
    var params = url.parse(process.env.DB_CONN);
    var auth = auth = params.auth.split(':');       
    var config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true
    }
    return new Pool(config);
};

logger.log('creating pool...');
var pool = create_pool();

var dbService = (function() {
  return {
    onConnect(err, client, done) {
      if (err) {
        logger.log(err);
        process.exit(1);
      }
    },
   query: function(text, values) {
    return new Promise(function(resolve, reject) {
      pg.connect(conString, function(err, client, done) {
        if(err) {
          reject(err);
        } else {
          client.query(text, values, function(err, result) {
            if(err) {
              reject(err);
            } else {
              done();
              resolve(result);
            }
          });
        }
      });
    });
   },
    //sseries: array of object, every object has key text mapped to values
    transaction: function(series) {
      var queryStrArr = [];
      return promisePG.connect(conString)
      .then(function(client) {
        return client.query('BEGIN');
      })
      .then(function() {
        return process.nextTick() 
      })
      .then(function() {
        series.forEach(function(queryStr) {
          queryStrArr.push(client.query(queryStr.text, queryStr.values))
        })
        return Promise.all(queryStrArr)
      })
      .then(function() {
        return client.query('COMMIT');
      })
      .then(undefined, function(err) {
        client.query('ROLLBACK');
        throw new myError(err.message, __line, 'db-service.js');
      })
    }
  };
})();

module.exports = dbService;