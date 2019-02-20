import http from "../core/utils/http.js";

export default {
    getPhysical: function() {
        var url = location.origin + "/sample/physical";

        return http.get(url).then(function(res) {
            return res;
        })
    },
    getLogical: function() {
        var url = location.origin + "/sample/logical";

        return http.get(url).then(function(res) {
            return res;
        })
    },
    getNodeType: function() {
        var url = location.origin + "/sample/nodetype"

        return http.get(url).then(function(res) {
            return res;
        })
    }
}