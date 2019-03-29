const moment = require('moment');
const _ = require('lodash');
var instance;
function PastStock() {
    this.table_name = 'past_stock';
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
        })
    }
}

PastStock.prototype.selectByCategory = function(param) {
    return khan.database(this.table_name).select(khan.database.raw('category, column_json(rawdata) as rawdata, unixtime')).where({category:param});
};

PastStock.prototype.selectDaily = function() {
    var ret = [];
    return khan.database(this.table_name).select(khan.database.raw('unixtime'))
    .where(khan.database.raw("category = '005930' AND column_get(rawdata, '전체상태' as char) IS NOT NULL")).orderBy("unixtime", "desc").map((row) => {
        var monent_time = moment(row.unixtime);
        var parent_id = monent_time.format("YYYY-MM")
        var parent_folder = ret.find((d) => { return d.id === parent_id})
        if(parent_folder) {
            parent_folder.children[parent_folder.children.length - 1]['prev_id'] = monent_time.format("YYYY-MM-DD")
            parent_folder.children.push({
                id : monent_time.format("YYYY-MM-DD"),
                name : monent_time.format("YYYY-MM-DD")
            })
        } else {
            ret.push({
                id : parent_id,
                name : parent_id,
                type:'folder',
                children:[{
                    id : monent_time.format("YYYY-MM-DD"),
                    name : monent_time.format("YYYY-MM-DD")
                }]
            });
        }
    }).then(() => {
        return ret;
    })
};

PastStock.prototype.selectRecommend = function(params) {
    var query = "SELECT * FROM (SELECT category as `id`, name, price,change_rate, volume_power,volume_percent,unixtime FROM ( SELECT current.*, current.volume / past.volume * 100 as volume_power, current.volume/current.total_volume*100 as volume_percent FROM ( SELECT category, column_get(rawdata,'종목명' as char) as name, column_get(rawdata, '거래량' as double) as volume,  column_get(rawdata, '저항갯수' as double) as regist_count, column_get(rawdata, '지지갯수' as double) as support_count, unixtime FROM past_stock WHERE (column_get(rawdata,'전체상태' as char) = '횡보' OR column_get(rawdata,'전체상태' as char) = '하락') AND unixtime >= '"+params.prev_id+"' AND unixtime <= '"+params.id+"') as past, ( SELECT category, column_get(rawdata, '종목명' as char) as name,  column_get(rawdata, '종가' as double) as price,  column_get(rawdata, '전일비율' as double) as change_rate,  column_get(rawdata, '거래량' as double) as volume,  column_get(rawdata, '전체상태' as char) as total_state,  column_get(rawdata, '현재상태' as char) as current_state, column_get(rawdata, '저항갯수' as double) as regist_count, column_get(rawdata, '지지갯수' as double) as support_count, column_get(rawdata, '상장주식수' as double) as total_volume, unixtime FROM past_stock WHERE column_get(rawdata,'현재상태' as char) = '상승' AND  column_get(rawdata,'전체상태' as char) = '상승' AND unixtime >= '"+params.id+"' AND unixtime <= '"+moment(params.id).add(1, 'day').format("YYYY-MM-DD")+"' AND column_get(rawdata, '거래량' as double) / column_get(rawdata, '상장주식수' as double) * 100 > 1) as current WHERE past.category = current.category AND current.regist_count < current.support_count AND past.regist_count > current.regist_count AND past.volume < current.volume) as test) as result ORDER BY volume_percent";
    return khan.database.raw(query).map((row) => {
        return row;
    })
}

PastStock.prototype.selectRecommends = function(params) {
    var query = "SELECT * FROM (SELECT category as `id`, name, price,change_rate, volume_power,volume_percent,unixtime FROM ( SELECT current.*, current.volume / past.volume * 100 as volume_power, current.volume/current.total_volume*100 as volume_percent FROM ( SELECT category, column_get(rawdata,'종목명' as char) as name, column_get(rawdata, '거래량' as double) as volume,  column_get(rawdata, '저항갯수' as double) as regist_count, column_get(rawdata, '지지갯수' as double) as support_count, unixtime FROM past_stock WHERE (column_get(rawdata,'전체상태' as char) = '횡보' OR column_get(rawdata,'전체상태' as char) = '하락') AND unixtime >= '"+params.prev_id+"' AND unixtime <= '"+params.id+"') as past, ( SELECT category, column_get(rawdata, '종목명' as char) as name,  column_get(rawdata, '종가' as double) as price,  column_get(rawdata, '전일비율' as double) as change_rate,  column_get(rawdata, '거래량' as double) as volume,  column_get(rawdata, '전체상태' as char) as total_state,  column_get(rawdata, '현재상태' as char) as current_state, column_get(rawdata, '저항갯수' as double) as regist_count, column_get(rawdata, '지지갯수' as double) as support_count, column_get(rawdata, '상장주식수' as double) as total_volume, unixtime FROM past_stock WHERE column_get(rawdata,'현재상태' as char) = '상승' AND  column_get(rawdata,'전체상태' as char) = '상승' AND unixtime >= '"+params.id+"' AND unixtime <= '"+moment(params.id).add(1, 'day').format("YYYY-MM-DD")+"' AND column_get(rawdata, '거래량' as double) / column_get(rawdata, '상장주식수' as double) * 100 > 1) as current WHERE past.category = current.category AND current.regist_count < current.support_count AND past.regist_count > current.regist_count AND past.volume < current.volume) as test) as result ORDER BY volume_percent";
    return khan.database.raw(query).then((rows) => {
        return rows[0];
    })
}

PastStock.prototype.selectData = function(category) {
    var query = "SELECT column_get(rawdata, '시가' as double) as `Open`, column_get(rawdata, '고가' as double) as `High`, column_get(rawdata, '저가' as double) as `Low`, column_get(rawdata, '종가' as double) as `Close`,column_get(rawdata, '거래량' as double) as `Volume`,unixtime FROM past_stock WHERE category = '"+category+"'";

    return khan.database.raw(query).then((rows) => {
        return rows[0];
    })
}

instance = instance ? instance : new PastStock();
module.exports = instance;