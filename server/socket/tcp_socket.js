var net = require('net');
module.exports = function(port) {
    var server = net.createServer(function(socket) {
        console.log(socket.address().address + " connected");
        socket.on('data', function(data){
            console.log('rcv :' + data);
        });
        socket.on('error', function(error){
            console.log('error :' + error);
        });
        socket.on('close', function() {
            console.log('client disconnected')
        })
        socket.write('welcome to server');
    })

    server.on('error', function(err) {
        console.log('err : ' + err);
    })

    server.listen(port, function(){
        console.log('listening on ' + port);
    })
}