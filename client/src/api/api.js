import http from "../core/utils/http.js";

export default {
    getNetController: function() {
        var url = "/sample/controller";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getUnderlay: function(params) {
        var url = "/sample/underlay";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    getOverlay: function(params) {
        var url = "/sample/overlay";
        return http.post(url, params).then(function(res) {
            return res;
        })
    },
    getSampleNodeType: function() {
        var url = location.origin + "/sample/nodetype"

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