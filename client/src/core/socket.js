import io from 'socket.io-client';

common.socket = (function() {
    var socket;
    function on(evt, func) {
        return socket.on(evt, func);
    }

    function off(evt) {
        return socket.off(evt);
    }

    function emit(evt, data) {
        return socket.emit(evt, data);
    }

    return {
        isConnected:false,
        connect:function() {
            var me = this;
            return new Promise(function(resolve, reject) {
                socket = io.connect({
                    path: '/socket.io',
                    transports: ['websocket'],
                    secure: true,
                }).on('connected', function(data) {
                    me.isConnected = true;
                    resolve(data);
                })
            })
        },
        disconnect:function() {
            var me = this;
            if(me.isConnected) {
                socket.disconnect();
            }
            me.isConnected = false;
        },
        on:on,
        off:off,
        emit:emit
    }
})()