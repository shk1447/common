var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "download" : function(req,res,next) {
            res.status(200).send();
        }
    },
    post: {
        "upload" : function(req,res,next) {
            res.status(200).send();
        }
    }
}