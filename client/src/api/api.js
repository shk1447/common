import http from "../core/utils/http.js";

export default {
    getNetController: function() {
        var url = "/network/controller";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getUnderlay: function(uuid) {
        var url = "/network/underlay?uuid=" + uuid;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getOverlay: function(uuid) {
        var url = "/network/controller?uuid=" + uuid;
        return http.get(url).then(function(res) {
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
    },
}