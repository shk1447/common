common.events = (function() {
    var handlers = {};

    function on(evt, func) {
        handlers[evt] = handlers[evt]||[];
        handlers[evt].push(func);
    }

    function off(evt, func) {
        var handler = handlers[evt];
        if(handler) {
            for(var i=0; i<handler.length;i++) {
                if(handler[i] === func) {
                    handler.splice(i,1);
                    return;
                }
            }
        }
    }

    function emit(evt,arg) {
        if(handlers[evt]) {
            for (var i=0;i<handlers[evt].length;i++) {
                try {
                    handlers[evt][i](arg);
                } catch(err) {
                    console.log("common.events.emit error: ["+evt+"] "+(err.toString()));
                    console.log(err);
                }
            }
        }
    }
    return {
        on:on,
        off:off,
        emit:emit
    }
})()