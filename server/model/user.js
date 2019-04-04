const _ = require('lodash');
var instance;
function User() {
    this.table_name = 'users';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index field"
        },
        email : {
            type :'string',
            unique:true,
            length: 50,
            index : ['index_email'],
            comment:"id field"
        },
        name : {
            type : 'string',
            length: 50,
            index : ['index_id_name'],
            comment:"name field"
        },
        created_at : {
            type : 'timestamp',
            length: 3,
            default : khan.database.fn.now(),
            index : ['index_created_at'],
            comment:"user created time"
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
                        var column = t[d.type](i);
                        if(d.default) column.defaultTo(d.default)
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

User.prototype.selectByEmail = function(param) {
    return khan.database(this.table_name).select('*').where({email:param});
};

User.prototype.insert = function(row) {
    return khan.database(this.table_name).insert(row);
}

instance = instance ? instance : new User();
module.exports = instance;