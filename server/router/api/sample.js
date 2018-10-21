const sample = require('../model/sample');

module.exports = {
    post: {
        "set": function(req,res,next) {
            res.status(200).send();
        }
    },
    get: {
        "search" : function(req,res,next){
            console.log(sample);
            res.status(200).send();
        }
    }
}