import http from "../core/utils/http.js";

export default {
    getFavoriteView: function(email,date) {
        var url = "/favorite/view?email=" + email + "&date=" + date;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getFavorite: function(email) {
        var url = "/favorite/list?email=" + email;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    setFavorite: function(params) {
        var url = "/favorite/set";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    logout: function() {
        var url = "/auth/logout";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    authCheck: function() {
        var url = "/auth/check";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    authGoogle: function() {
        var url = "/auth/google";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getDaily: function() {
        var url = "/stock/daily";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getRecommend: function(params) {
        var url = "/stock/recommend";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    getRecommends: function(params) {
        var url = "/stock/recommends";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    getData: function(id, end_date) {
        var url = "/stock/data?id=" + id + "&to_date=" + end_date;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getList: function(id) {
        var url = "/stock/search?id=" + id;
        return http.get(url).then(function(res) {
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