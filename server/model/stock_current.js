const _ = require('lodash');
var instance;
function CurrentStock() {
    this.table_name = 'current_stock';
    this.schema = {
        idx : {
            type:'increments',
            comment:"index"
        },
        category : {
            type :'string',
            length: 50,
            unique: true,
            index : ["idx_columns","idx_category"],
            comment:"key"
        },
        rawdata : {
            type : 'binary',
            comment:"property information"
        },
        unixtime : {
            type : 'timestamp',
            length: 6,
            unique: true,
            index : ["idx_columns","idx_unixtime"],
            default : khan.database.fn.now()
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

CurrentStock.prototype.selectByCategory = function(param) {
    return khan.database(this.table_name).select(khan.database.raw('category, column_json(rawdata) as rawdata, unixtime')).where({category:param});
};

CurrentStock.prototype.selectByParam = function(param) {
    return khan.database(this.table_name).select(khan.database.raw("category, column_get(rawdata, '종목명' as char) as name, unixtime"))
        .where(khan.database.raw("column_get(rawdata,'종목명' as char) like '%" + param + "%' OR category like '%"+param+"%'"));
};

CurrentStock.prototype.selectAll = function() {
    return khan.database(this.table_name).select(khan.database.raw('category, column_json(rawdata) as rawdata, unixtime')).map((row) => {
        row.rawdata = JSON.parse(row.rawdata);
        return row;
    })
};

CurrentStock.prototype.selectJoinFavorite = function(param, email) {
    return khan.database.select(khan.database.raw("current_stock.category, column_get(current_stock.rawdata, '종목명' as char) as name, favorite.favorite_type, current_stock.unixtime")).from(this.table_name).leftJoin('favorite', 'current_stock.category', 'favorite.category').where(khan.database.raw("column_get(current_stock.rawdata,'종목명' as char) like '%" + param + "%' OR current_stock.category like '%"+param+"%' AND favorite.email = '"+email+"'"));
}

instance = instance ? instance : new CurrentStock();
module.exports = instance;