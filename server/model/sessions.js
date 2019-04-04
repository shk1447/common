const _ = require('lodash');
var instance;
function Sessions() {
    this.table_name = 'sessions';
    
    this.initialize = function() {
        khan.database.schema.hasTable(this.table_name).then((exists) => {
            if(!exists) {
                return khan.database.schema.createTable(this.table_name, function(t) {
                    t.string('sid').primary();
                    t.text('sess').notNullable();
                    t.dateTime('expired').notNullable().index();
                })
            }
        }).catch((err) => {
            console.log(this.table_name , ": initialize error")
        })
    }
}

instance = instance ? instance : new Sessions();
module.exports = instance;