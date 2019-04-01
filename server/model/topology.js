const _ = require('lodash');
var instance;
function Topology() {
    this.table_name = 'topology';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index"
        },
        id : {
            type :'string',
            length: 50,
            notNullable : true,
            unique: true,
            index : ["index_id"],
            comment:"network controller id"
        },
        type : {
            type : 'string',
            length: 10,
            notNullable : true,
            index : ["index_type"],
            comment:"link or node"
        },
        props : {
            type : 'binary',
            comment:"property information"
        }
    }
    
    this.initialize = function() {
        khan.database.schema.hasTable(this.table_name).then((exists) => {
            if(!exists) {
                var schema = this.schema;
                var table_name = this.table_name;
                return khan.database.schema.createTable(this.table_name, function(t) {
                    var indexer = {};
                    var unique_keys = [];
                    _.each(schema, (d,i) => {
                        var column = d.length ? t[d.type](i, d.length) : t[d.type](i);
                        if(d.default) column.defaultTo(d.default);
                        if(d.comment) column.comment(d.comment);

                        if(d.unique) unique_keys.push(i);

                        if(d.index && d.index.length > 0) {
                            _.each(d.index, (index_name, k) => {
                                if(indexer[table_name+'_'+index_name]) {
                                    indexer[table_name+'_'+index_name].push(i)
                                } else {
                                    indexer[table_name+'_'+index_name] = [i];
                                }
                            })
                        }
                    })
                    
                    if(unique_keys.length > 0) t.unique(unique_keys);
                    _.each(indexer, (d, i) => {
                        t.index(d, i);
                    })
                })
            }
        }).catch((err) => {
            console.log(this.table_name , ": initialize error")
        })
    }
}

Topology.prototype.select = function() {
    return khan.database(this.table_name).select('*');
};

Topology.prototype.upsert = function() {
    var query = "INSERT INTO " + this.table_name + " "
    khan.database.raw()
}

instance = instance ? instance : new Topology();
module.exports = instance;