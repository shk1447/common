const _ = require('lodash');
const path = require('path');
const api = require('./api')

module.exports = function(app,config) {
    function ensureAuth(req,res,next) {
        if(req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/#/');
        }
    }

    // api module loader
    _.each(api, (routes, path) => {
        _.each(routes, (funcs, routeName) => {
            _.each(funcs, (func, funcName) => {
                if(path !== 'auth') {
                    app[routeName]('/' + path + '/' + funcName, ensureAuth, func);
                } else {
                    app[routeName]('/' + path + '/' + funcName, func);
                }
            })
        })
    })

    app.get('/', function(req,res,next) {
        res.sendFile(path.resolve(process.env.root_path, './index.html'));
    })
}