var socket_io = require('socket.io');

module.exports = function(httpServer,khan) {
    var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
    io.sockets.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log('disconnected ', socket.id);
        });

        socket.emit('connected', {id:socket.id });
        khan.socket.clients.push(socket);
    })
    khan["socket"] = {
        io:io,
        clients:[]
    }
}