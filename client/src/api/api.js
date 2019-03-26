import http from "../core/utils/http.js";

export default {
    getDaily: function() {
        var url = "/stock/daily";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getRecommends: function(params) {
        var url = "/stock/recommends";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    setTopology: function(data) {
        var url = "/topology/save";
        return http.post(url, data).then(function(res) {
            return res;
        })
    },
    getTopology: function(data) {
        var url = "/topology/search";
        return http.get(url).then(function(res) {
            return res;
        })
    }
}