var pg = require('pg'),
    log = require('./utils/log')(module),
    os = require('os'),
    async = require('async'),
    config = require('./config');

var connectionString = process.env.DATABASE_URL || config.get('database:connection');
var client = new pg.Client(connectionString);

function openConnection(cb) {
    client.connect(function(error) {
        if(error)
            throw error;
        log.info('Database connection is opened');
        cb();
    });
}

function dropDatabase(cb) {
    client.query("CREATE TABLE IF NOT EXISTS users (mid BIGINT PRIMARY KEY, \
        latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, timestamp DOUBLE PRECISION);",
        function(error) {
            if (error)
               throw error;
    });

    client.query("CREATE EXTENSION IF NOT EXISTS cube;", function(error) {
        if (error)
            throw error;
        log.info('Extension cube is created');
    });

    client.query("CREATE OR REPLACE RULE insert_ignore_users AS \
        ON INSERT TO \
            users \
        WHERE EXISTS \
            ( SELECT 1 FROM users WHERE mid = NEW.mid ) \
        DO INSTEAD NOTHING;",
        function(error) {
            if(error)
                throw error;
            log.info('Extension cube is created');
    });

    client.query("CREATE EXTENSION IF NOT EXISTS earthdistance;", function(error) {
        if(error)
            throw error;
        log.info('Extension earthdistance is created');
        cb();
    });
}

function closeConnection() {
    client.end(function(error) {
        if (error)
            throw error;
        log.info('Database connection is closed');
    });
}

async.series(
    [
        openConnection,
        dropDatabase
    ],
    closeConnection
);
