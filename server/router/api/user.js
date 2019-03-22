var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "search" : function(req,res,next) {
            res.status(200).send();
        },
        "logout" : function(req,res,next) {
            
        }
    },
    post: {
        "login" : function(req,res,next) {
            res.status(200).send();
        },
        "add" : function(req,res,next) {

        },
        "remove" : function(req,res,next) {

        }
    }
}