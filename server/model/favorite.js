const _ = require('lodash');
var instance;
function Favorite() {
    this.table_name = 'favorite';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index field"
        },
        category : {
            type :'string',
            unique:true,
            length: 50,
            index : ['index_category'],
            comment:"id field"
        },
        email : {
            type :'string',
            unique:true,
            length: 50,
            index : ['index_email'],
            comment:"id field"
        },
        favorite_type : {
            type : 'string',
            length: 50,
            index : ['index_favorite_type'],
            comment:"name field"
        },
        rawdata : {
            type : 'binary',
            comment:"property information"
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

Favorite.prototype.selectByEmail = function(param) {
    return khan.database(this.table_name).select(khan.database.raw('`category` as `id`, column_get(`rawdata`, "name" as char) as `name`,column_json(`rawdata`) as `props`')).where({email:param});
};

Favorite.prototype.insert = function(param) {
    var query = 'INSERT INTO '+ this.table_name +' ('
    var values = 'VALUES (';
    var upsertQuery = ' ON DUPLICATE KEY UPDATE '
    function dynamicQuery(obj) {
        var ret_query = "COLUMN_CREATE("
        _.each(obj, (v,k) => {
            if(typeof v === 'object') {
                ret_query += '"' + k + '",' + dynamicQuery(v) + ",";
            } else {
                ret_query += '"' + k + '",' + '"' + v + '",';
            }
        })
        ret_query = ret_query.slice(0, -1) + ")"
        return ret_query;
    }

    _.each(param, (v,k) => {
        var value;
        if(typeof v === 'object') {
            value = dynamicQuery(v);
            values += value + ',';
        } else {
            value = '"' + v + '"';
            values +=  value + ',';
        }
        query += '`' + k + '`,'
        upsertQuery += '`' + k + '` = ' + value + ',';
    })
    query = query.slice(0, -1) + ") ";
    query += values.slice(0, -1) + ")";
    query += upsertQuery.slice(0,-1);
    console.log(query);
    return khan.database.raw(query);
};

Favorite.prototype.remove = function(param) {
    return khan.database(this.table_name).where(param).del();
}



instance = instance ? instance : new Favorite();
module.exports = instance;