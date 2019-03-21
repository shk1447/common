const _ = require('lodash');
var instance;
function User() {
    this.table_name = 'users';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index field"
        },
        id : {
            type :'string',
            unique:true,
            length: 50,
            index : ['index_id_password'],
            comment:"id field"
        },
        password : {
            type : 'string',
            length: 50,
            index : ['index_id_password'],
            comment:"password field"
        },
        type : {
            type : 'string',
            length: 10,
            index : ['index_type'],
            comment:"user type [admin, user]"
        },
        created_at : {
            type : 'timestamp',
            length: 6,
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
        })
    }
}

User.prototype.select = function() {
    return khan.database(this.table_name).select('*');
};

User.prototype.upsert = function() {
    var query = "INSERT INTO " + this.table_name + " "
    khan.database.raw()
}

instance = instance ? instance : new User();
module.exports = instance;