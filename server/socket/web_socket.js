var socket_io = require('socket.io');
var WebSocket = require('ws');
var request = require('request');

module.exports = function(httpServer,khan) {
    var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
    io.sockets.on('connection', function(socket){
        console.log(process.env.wsUrl);
        var ws = new WebSocket(process.env.wsUrl);
        ws.binaryType = "arraybuffer";
        ws.on('open', function() {
            console.log('test');
            socket.emit('connected', 'ok');
        });
        ws.on('message', function(message) {
            var d = JSON.parse(message);
            var msg = JSON.parse(d.result);
            
            if(d.broadcast) {
                io.sockets.emit(d.target + "." + d.method, msg);
            } else {
                socket.emit(d.target + "." + d.method, msg);
            }
        }); 

        socket.on('fromclient', function(data){
            try {
                var sendData = JSON.stringify(data);
                if(data.protocol && data.protocol == "http") {
                    var options = {
                        url: config.url.httpUrl + '/' + data.target + '/' + data.method,
                        method: 'POST',
                        headers: {'content-type': 'application/json'},
                        body: JSON.stringify(data.parameters)
                    };
        
                    request(options, function(err, res, body) {
                        var result = JSON.parse(body);
                        var msg = JSON.parse(result.message);
                        socket.emit(data.target + "." + data.method, msg);
                    });
                } else {
                    ws.send(sendData);
                }
            } catch (error) {
                console.log(error);
            }
        });

        
        socket.on('disconnect', function(){
            console.log('disconnected ', socket.id);
            ws.close();
        });
    })
}