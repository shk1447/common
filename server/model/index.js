
module.exports = function() {
    return {
        user:require('./user'),
        sessions:require('./sessions'),
        topology:require('./topology'),
        current_stock: require('./stock_current'),
        past_stock: require('./stock_past')
    }
}