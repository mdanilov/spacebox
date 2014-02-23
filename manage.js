var sqlite = require('sqlite3'),
    log = require('./utils/log')(module),
    os = require('os'),
    config = require('./config');

db = new sqlite.cached.Database(config.get('database'), sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);

if (process.env.ENV_NODE == 'development') {
    sqlite.verbose();
}

db.serialize(function() {
    db.run("\
        CREATE TABLE IF NOT EXISTS geo ( \
        user_id BIGINTEGER PRIMARY KEY, \
        latitude DOUBLE, longitude DOUBLE, timestamp DOUBLE \
        ); \
        ", function(error) {
            if (error != null) {
                log.error(error.message);
            }
    });

    // TODO
    // What's about using MySQL for distance calculating
    // Haversine formula
    //db.run("\
    //    DELIMITER $$ \
    //    DROP FUNCTION IF EXISTS geodist $$ \
    //    CREATE FUNCTION geodist ( \
    //    src_lat DECIMAL(9,6), src_lon DECIMAL(9,6), \
    //    dst_lat DECIMAL(9,6), dst_lon DECIMAL(9,6) \
    //    ) RETURNS DECIMAL(6,2) DETERMINISTIC \
    //    BEGIN \
    //     SET @dist := 6371 * 2 * ASIN(SQRT( \
    //          POWER(SIN((src_lat - ABS(dst_lat)) * PI()/180 / 2), 2) + \
    //          COS(src_lat * PI()/180) * \
    //          COS(ABS(dst_lat) * PI()/180) * \
    //          POWER(SIN((src_lon - dst_lon) * PI()/180 / 2), 2) \
    //        )); \
    //     RETURN @dist; \
    //    END $$ \
    //    DELIMITER ; \
    //    ", function(error) {
    //        if (error != null) {
    //            log.error(error.message);
    //        }
    //});

    //db.run("\
    //    DELIMITER $$ \
    //    DROP FUNCTION IF EXISTS geodist_pt $$ \
    //    CREATE FUNCTION geodist_pt (src POINT, dst POINT) \
    //    RETURNS DECIMAL(6,2) DETERMINISTIC \
    //    BEGIN \
    //      RETURN geodist(X(src), Y(src), X(dst), Y(dst)); \
    //    END $$ \
    //    DELIMITER ; \
    //    ", function(error) {
    //        if (error != null) {
    //            log.error(error.message);
    //        }
    //});

    //db.run("\
    //    DELIMITER $$ \
    //    DROP PROCEDURE IF EXISTS geobox_pt $$ \
    //    CREATE PROCEDURE geobox_pt ( \
    //        IN pt POINT, IN dist DECIMAL(6,2), \
    //        OUT top_lft POINT, OUT bot_rgt POINT \
    //    ) DETERMINISTIC \
    //    BEGIN \
    //      CALL geobox(X(pt), Y(pt), dist, @lat_top, @lon_lft, @lat_bot, @lon_rgt); \
    //      SET top_lft := POINT(@lat_top, @lon_lft); \
    //      SET bot_rgt := POINT(@lat_bot, @lon_rgt); \
    //    END $$ \
    //    DELIMITER ; \
    //    ", function(error) {
    //        if (error != null) {
    //            log.error(error.message);
    //        }
    //});

    //db.run("\
    //    DELIMITER $$ \
    //    DROP PROCEDURE IF EXISTS geobox $$ \
    //    CREATE PROCEDURE geobox ( \
    //      IN src_lat DECIMAL(9,6), IN src_lon DECIMAL(9,6), IN dist DECIMAL(6,2), \
    //      OUT lat_top DECIMAL(9,6), OUT lon_lft DECIMAL(9,6), \
    //      OUT lat_bot DECIMAL(9,6), OUT lon_rgt DECIMAL(9,6) \
    //    ) DETERMINISTIC \
    //    BEGIN \
    //      SET lat_top := src_lat + (dist / 69); \
    //      SET lon_lft := src_lon - (dist / ABS(COS(RADIANS(src_lat)) * 69)); \
    //      SET lat_bot := src_lat - (dist / 69); \
    //      SET lon_rgt := src_lon + (dist / ABS(COS(RADIANS(src_lat)) * 69)); \
    //    END $$ \
    //    DELIMITER ; \
    //    ", function(error) {
    //        if (error != null) {
    //            log.error(error.message);
    //        }
    //});

    setInterval(function() {
        db.run("DELETE FROM geo WHERE timestamp < $time ;",
            {
                $time: os.uptime() - config.get('interval')
            },
            function(error) {
                if (error != null) {
                    log.error(error.message);
                }
        });
    }, config.get('interval') * 1000);

    if (config.get('database') != ':memory:') {
        db.close();
    }
});
