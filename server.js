var http = require('http');
var url = require('url');
var port = process.env.port || 1337;

var server = http.createServer(function(request, response) {

    response.on('close', function() {
        console.log("The underlying connection was terminated.");
    });

    response.on('finish', function() {
        console.log("The response has been sent.");
    });

    console.log(request.httpVersion, request.headers, request.method);

    var body = 'hello world'
    if (request.method === 'GET')
    {
        body += url.parse(request.url, true).query['data'];
    }

    response.emit('close');
    response.writeHead(200, {
         'Content-Length': body.length,
         'Content-Type': 'text/plain' });
    response.write(body)
    response.end();


});

server.listen(port);

server.on('close', function() {
    console.log("Server is shutdown!");
    server.listen(port);
});

server.on('clinetError', function(exception, socket) {
    console.log("Client connection error!");
});