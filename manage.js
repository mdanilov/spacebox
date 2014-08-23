var pg = require('pg');
var async = require('async');
var log = require('./utils/log')(module);
var config = require('./config');

var client = new pg.Client(config.get('database:connection'));

function openConnection (callback) {
    client.connect(function (error) {
        if (error)
            log.error(error);
        else
            log.info('Database connection is opened');
        callback(error);
    });
}

function dropDatabase(cb) {
    client.query("CREATE TABLE IF NOT EXISTS users (mid BIGINT PRIMARY KEY," +
        "latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, timestamp DOUBLE PRECISION);",
        function(error) {
            if (error)
                log.error(error);
            else
                log.info('Table users is created');
    });

    client.query("CREATE EXTENSION IF NOT EXISTS cube;", function(error) {
        if (error)
            log.error(error);
        else
            log.info('Extension cube is created');
    });

    // TODO
    // Speeding up these queries
    //client.query("CREATE INDEX distance_index ON users USING gist(ll_to_earth(latitude, longitude));", function(error) {
    //    if (error)
    //        throw error;
    //    log.info('Speeding up index is created');
    //});

    client.query("CREATE EXTENSION IF NOT EXISTS earthdistance;", function(error) {
        if (error)
            log.error(error);
        else
            log.info('Extension earthdistance is created');
        cb();
    });
}

function closeConnection (error, results) {
    client.end();
    log.info('Database connection is closed');
}

async.series(
    [
        openConnection,
        dropDatabase
    ],
    closeConnection
);
