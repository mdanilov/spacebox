var http = require('http');
var url = require('url');
var sqlite = require('sqlite3');
var os = require('os');

var port = process.env.port || 8080;

var db = new sqlite.Database(":memory:", sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, function(error) {
    if (error != null) {
        console.log(error);
    }
    else {
        console.log("Successfuly open database!");
        db.run("CREATE TABLE IF NOT EXISTS core (user_id BIGINTEGER PRIMARY KEY, latitude DOUBLE, longitude DOUBLE, timestamp DOUBLE);", function(error) {
            if (error != null) {
                console.log(error);
            }
            else {
                server.listen(port);
            }
        });
    }
});

var validateRequest = function(request) {
    if (request.method === 'GET') {
        query = url.parse(request.url, true).query;
        if (query['user_id'] && query['latitude'] && query['longitude']) {
            console.log("Correct request URL: ", request.url);
            return query;
        }
    }

    console.log("Wrong request URL: ", request.url);

    return null;
};

var server = http.createServer(function(request, response) {

    response.on('close', function() {
        console.log("The underlying connection was terminated.");
    });

    response.on('finish', function() {
        console.log("The response has been sent.");
    });

    console.log(request.httpVersion, request.headers, request.method);

    var query = validateRequest(request);
    if (query != null)
    {
        db.run("REPLACE INTO core (user_id, latitude, longitude, timestamp) VALUES ($id, $latitude, $longitude, $timestamp);",
            {
                $id: query['user_id'],
                $latitude: query['latitude'],
                $longitude: query['longitude'],
                $timestamp: os.uptime()
            },
            function(error) {
                if (error != null) {
                    console.log(error);
                }
        });

        db.all("SELECT * FROM core;", function(error, rows) {
            if (rows.length != 0) {
                var json = JSON.stringify(rows)
                response.writeHead(200, {
                     'Content-Length': Buffer.byteLength(json),
                     'Content-Type': 'text/html' });
                response.write(json);                
            }
            response.end();
        });
    }
    else {        
        response.end();
    }
});

server.on('close', function() {
    console.log("Server is shutdown!");
    server.listen(port);
});

server.on('clinetError', function(exception, socket) {
    console.log("Client connection error!");
});