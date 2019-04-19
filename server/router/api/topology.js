var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "search" : function(req,res,next) {
            try {
                khan.model.topology.selectByCtrl(req.query.ctrl_uuid).then((rows) => {
                    var data = {};
                    if(rows.length > 0) {
                        data = JSON.parse(rows[0].topology);
                    }
                    
                    res.status(200).send(data);
                }).catch((err) => {
                    res.status(500).send(err);
                })
            } catch(error) {
                res.status(500).send(error);
            }
        }
    },
    post: {
        "save" : function(req,res,next) {
            khan.model.topology.upsert(req.body.activeNodes).then(() => {
                res.status(200).send();
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    }
}