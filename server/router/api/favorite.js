var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "list" : function(req,res,next) {
            khan.model.favorite.selectByEmail(req.query.email).then((rows) => {
                res.status(200).send(rows);
            }).catch((err) => {
                res.status(500).send();
            })
        },
        "view": function(req,res,next) {
            khan.model.favorite.selectForView({email:req.query.email, date:req.query.date}).then((rows) => {
                rows = rows.map((d) => {
                    d.total_state = d.total_state.split(',');
                    d.current_state = d.current_state.split(',');
                    return d;
                })
                res.status(200).send(rows);
            }).catch((err) => {
                res.status(500).send();
            })
        }
    },
    post: {
        "set": function(req,res,next) {
            var queryExecutor;
            var param = req.body;
            if(param.favorite) {
                // insert favorite
                queryExecutor = khan.model.favorite.insert({
                    category:param.category,email:param.email,favorite_type:param.alarm ? 'alarm': 'default', rawdata:param.rawdata
                })
            } else {
                // remove favorite
                queryExecutor = khan.model.favorite.remove({category:param.category,email:param.email});
            }

            queryExecutor.then(() => {
                res.status(200).send();
            }).catch((err) => {
                res.status(500).send();
            })
        }
    }
}