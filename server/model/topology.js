const _ = require('lodash');
var instance;
function Topology() {
    this.table_name = 'topology';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index"
        },
        uuid : {
            type :'string',
            length: 50,
            notNullable : true,
            unique: true,
            index : ["index_uuid"],
            comment:"node uuid"
        },
        ctrl_uuid : {
            type :'string',
            length: 50,
            notNullable : true,
            unique: true,
            index : ["index_ctrl_uuid"],
            comment:"network controller uuid"
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
        })
    }
}

Topology.prototype.selectByCtrl = function(ctrl_uuid) {
    return khan.database(this.table_name)
        .select(khan.database.raw("CONCAT('{',GROUP_CONCAT(CONCAT('\"', `uuid`, '\":' , column_json(props))),'}') as `topology`"))
        .where({ctrl_uuid:ctrl_uuid}).groupBy("ctrl_uuid");
};

Topology.prototype.upsert = function(params) {
    var query = 'INSERT INTO '+ this.table_name +' ('
    var fields = [];
    var values = 'VALUES ';
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

    _.each(params, (param,i) => {
        values += "("
        _.each(param, (v,k) => {
            var value;
            if(typeof v === 'object') {
                value = dynamicQuery(v);
                values += value + ',';
            } else {
                value = '"' + v + '"';
                values +=  value + ',';
            }
            if(!fields.includes(k)) fields.push(k);
        })
        values = values.slice(0,-1) + "),"
    })
    _.each(fields, (field,i) => {
        query += '`' + field + '`,'
        upsertQuery += '`' + field + '` = VALUES(' + field + '),';
    })
    query = query.slice(0, -1) + ") ";
    query += values.slice(0, -1);
    query += upsertQuery.slice(0,-1);
    console.log(query);
    return khan.database.raw(query);
}

instance = instance ? instance : new Topology();
module.exports = instance;