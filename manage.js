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

function dropDatabase (callback) {
    client.query("CREATE TABLE IF NOT EXISTS users (mid BIGINT PRIMARY KEY, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, timestamp DOUBLE PRECISION);",
        function (error) {
            if (error)
                log.error(error);
            else
                log.info('Table USERS is created');
        });

    client.query("CREATE TABLE IF NOT EXISTS likes (mid BIGINT, liked BIGINT, status INT, timestamp DOUBLE PRECISION);",
        function (error) {
            if (error)
                log.error(error);
            else
                log.info('Table LIKES is created');
        });

    client.query("CREATE TABLE IF NOT EXISTS friends (mid1 BIGINT, mid2 BIGINT);",
        function (error) {
            if (error)
                log.error(error);
            else
                log.info('Table FRIENDS is created');
        });

    client.query("CREATE TABLE IF NOT EXISTS connect_session (sid VARCHAR NOT NULL, expires TIMESTAMP WITHOUT TIME ZONE NOT NULL, session JSON NOT NULL, CONSTRAINT sid_pk PRIMARY KEY (sid));",
        function (error) {
            if (error)
                log.error(error);
            else
                log.info('Table CONNECT_SESSION is created');
        });

    client.query("CREATE OR REPLACE RULE ignore_duplicate_inserts AS ON INSERT TO likes WHERE (EXISTS ( SELECT 1 FROM likes WHERE likes.mid = new.mid AND likes.liked = new.liked)) DO INSTEAD NOTHING;",
        function (error) {
            if (error)
                log.error(error);
            else
                log.info('Rule ignore_duplicate_inserts for table LIKES is created');
        });

    client.query("CREATE EXTENSION IF NOT EXISTS cube;", function (error) {
        if (error)
            log.error(error);
        else
            log.info('Extension CUBE is created');
    });

    // TODO: Speeding up these queries
    //client.query("CREATE INDEX distance_index ON users USING gist(ll_to_earth(latitude, longitude));", function(error) {
    //    if (error)
    //        throw error;
    //    log.info('Speeding up index is created');
    //});

    client.query("CREATE EXTENSION IF NOT EXISTS earthdistance;", function (error) {
        if (error)
            log.error(error);
        else
            log.info('Extension EARTHDISTANCE is created');
        callback();
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
