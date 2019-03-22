var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "list" : function(req,res,next) {
            khan.model.current_stock.selectAll().then((data) => {
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send(err);
            })
        },
        "goods" : function(req,res,next) {
            khan.model.past_stock.selectGoods().then((data) => {
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    },
    post: {
        "upload" : function(req,res,next) {
            res.status(200).send();
        }
    }
}