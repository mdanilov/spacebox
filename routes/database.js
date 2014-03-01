var log = require('../utils/log')(module),
    sqlite = require('sqlite3'),
    config = require('../config'),
    os = require('os'),
    validator = require('validator');

var isCoordinateValid = function (params) {
    if (validator.isFloat(params['latitude']) &&
        validator.isFloat(params['longitude'])) {
        return true;
    }

    return false;
};

/**
 * Method: GET
 * URI: /user
 * */
exports.addUser = function(request, response) {
    if (isCoordinateValid(request.query)) {
        if (config.get('database') != ':memory:') {
            db = new sqlite.cached.Database(config.get('database'), sqlite.OPEN_READWRITE);
        }

        f = os.uptime();

        db.serialize(function() {
            db.run("REPLACE INTO geo (user_id, latitude, longitude, timestamp) VALUES ($id, $lat, $long, $time);",
                {
                    $id: request.session.mid,
                    $lat: request.query['latitude'],
                    $long: request.query['longitude'],
                    $time: os.uptime()
                },
                function (error) {
                    if (error != null) {
                        log.error(error);
                    }
            });
            
            db.all("SELECT user_id, latitude, longitude FROM geo;", function (error, rows) {
                if (error != null) {
                    log.error(error);
                }
                else {
                    if (rows) {
                        response.json(rows);
                        return;
                    }
                }

                response.end();
            });

            // Haversine formula
            //db.all("\
            //    SELECT @src := Point(latitude, longitude) FROM geo WHERE user_id = $id; \
            //    CALL geobox_pt(@src, 1.0, @top_lft, @bot_rgt); \
            //    SELECT g.user_id, geodist(X(@src), Y(@src), latitude, longitude) AS dist \
            //    FROM geo g \
            //    WHERE latitude BETWEEN X(@top_lft) AND X(@bot_rgt) \
            //    AND longitude BETWEEN Y(@top_lft) AND Y(@bot_rgt) \
            //    HAVING dist < 1.0 \
            //    ORDER BY dist desc; \
            //    ",
            //    {
            //        $id: request.body['user_id']
            //    },
            //    function (error, rows) {
            //        if (rows) {
            //            response.json(rows);
            //        }
            //        else {
            //            response.end();
            //        }
            //});

            if (config.get('database') != ':memory:') {
                db.close();
            }
        });
    }
    else {
        response.end();
    }
};
