var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    get : {
        "search" : function(req,res,next) {
            var response = {};
            var file_path = path.resolve(process.env.root_path, './output/topology.json')
            if(fs.existsSync(file_path)) {
                var contents = fs.readFileSync(file_path,'utf8');
                response = JSON.parse(contents);
            }
            res.status(200).send(response);
        }
    },
    post: {
        "save" : function(req,res,next) {
            var file_path = path.resolve(process.env.root_path, './output/topology.json')
            fsPath.writeFileSync(file_path, JSON.stringify(req.body, null, 2), 'utf8');
            res.status(200).send();
        }
    }
}