const net = require('net');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const busboy = require("connect-busboy");
var compression = require('compression');
var helmet = require('helmet');

const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);

const passport = require('passport');

var cluster = require('cluster');
var os = require('os');

// rdbms connector & query builder
const knex = require('knex');

const socket = require('./socket');
const router = require('./router');
const runtime = require('./runtime');

khan = {
    service:true,
    session_store:null,
    database:null,
    logger:require('./utils/logger')
}

module.exports = function(config) {
    ClusterServer = {
        name: 'ClusterServer',
        
        cpus: os.cpus().length,
        
        autoRestart: true,
        
        start: function (server, port) {
            var me = this,
                i;
            
            function eachWorker(callback) { for (var id in cluster.workers) { callback(cluster.workers[id]); } }
            
            if (cluster.isMaster) {
                for (i = 0; i < me.cpus; i += 1) {
                    var worker = cluster.fork();

                    worker.on('message', function(msg) {
                        eachWorker(function(_worker) {
                            _worker.send(msg);
                        })
                    })
                }
                
                cluster.on('death', function (worker) {
                    khan.logger.warn(me.name + ': worker ' + worker.pid + ' died.')
                    if (me.autoRestart) {
                        khan.logger.warn(me.name + ' Restarting worker thread...')
                        cluster.fork();
                    }
                });
            } else {
                process.on("message", function(msg) {
                    khan.socket.clients.forEach((s) => {
                        s.emit(msg.event,msg.data)
                    });
                })

                server.listen(port,'0.0.0.0', function(){
                    khan.logger.info(me.name + ' starting worker thread #' + cluster.worker.id);
                }).on('error', function(err){
                    khan.logger.error(err.message);
                })
            }
        }
    }

    var app = express();
    
    // middle-ware performance check!
    app.set('view cache', true);
    app.use('/', express.static(process.env.root_path));
    app.use(helmet());
    app.use(helmet.xssFilter());
    app.disable('x-powered-by');
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({limit:'5mb',extended:true}));
    app.use(bodyParser.json({limit:'5mb'}));

    router(app,config);
    khan['app'] = app;
    runtime.init(khan);
    runtime.load();

    var server = config.https ? https.createServer({
        key:fs.readFileSync(path.resolve(process.env.root_path, './cert/key.pem')),
        cert:fs.readFileSync(path.resolve(process.env.root_path, './cert/cert.pem'))
    },app) : http.createServer(app);
     
    // 서버 전체 에러 이벤트 리스닝
    server.addListener("error", (err) => {
        khan.logger.error(err.message);
    });
    socket.web_socket(server,khan);
    
    ClusterServer.name = 'khan';
    ClusterServer.start(server, process.env.port);
}