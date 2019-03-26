var _ = require('lodash');
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
        "daily" : function(req,res,next) {
            khan.model.past_stock.selectDaily().then((data) => {
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    },
    post: {
        "recommend" : function(req,res,next) {
            khan.model.past_stock.selectRecommend(req.body).then((data) => {
                res.status(200).send(data[0]);
            }).catch((err) => {
                res.status(500).send(err);
            })
        },
        "recommends" : function(req,res,next) {
            var daylist = req.body;
            var promises = [];
            _.each(daylist, (param) => {
                promises.push(khan.model.past_stock.selectRecommends(param));
            })
            Promise.all(promises).then((result) => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    }
}