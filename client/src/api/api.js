import http from "../core/utils/http.js";

export default {
    getGoods: function() {
        var url = "/stock/goods";
        return http.get(url).then(function(res) {
            return res;
        })
    }
}