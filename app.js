var http = require('http');
var WebSocketServer = require('ws').Server;
var fs = require('fs');
var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-type' : 'text/html'});
    res.end(fs.readFileSync('./index.html', 'utf-8'));
});

var wss = new WebSocketServer({ server: server});
server.listen(process.env.PORT || 3000);

var connections = [];

wss.on('connection', function(ws){
    connections.push(ws);
    console.log('connection');

    ws.on('close', function(){
        console.log('close');
        connections = connections.filter(function (conn, i){
            console.log(ws);
            return (conn === ws) ? false : true;
        });
    });
    
    ws.on('message', function(message){
        console.log('recv: %s', message);
        broadcast((message));
//        ws.send('Hello from js');
    });

});

function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};

