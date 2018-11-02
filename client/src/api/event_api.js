import io from 'socket.io-client';


export default function() {
    var socket = io.connect();
    function subscribe(event, callback) {

    }
    socket.on('connected', function(data){
        console.log(data.id);
    })

    return {
        socket : function() {
            return socket;
        },
        subscribe : function(event, callback) {
            console.log(event);
        },
        disconnect: function() {
            socket.disconnect();
            socket.close();
        }
    }
};