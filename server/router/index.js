const _ = require('lodash');
const path = require('path');
const api = require('./api')

module.exports = function(app,config) {
    // api module loader
    _.each(api, (routes, path) => {
        _.each(routes, (funcs, routeName) => {
            _.each(funcs, (func, funcName) => {
                app[routeName]('/' + path + '/' + funcName, func);
            })
        })
    })

    app.get('/', function(req,res,next) {
        res.sendFile(path.resolve(process.env.root_path, './index.html'));
    });
}