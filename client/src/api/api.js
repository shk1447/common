import http from "../core/utils/http.js";

export default {
    getNetController: function(manager_id) {
        var url = "/v1/fluid/network/underlay/manager";
        if(manager_id) url += "/" + manager_id;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getParentSwitch: function(manager_id, switch_id) {
        var url = "/v1/fluid/network/underlay/" + manager_id;
        if(switch_id) url += "/spine/" + switch_id
        else url += "/spine"
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getChildSwitch:function(manager_id, switch_id) {
        var url = "/v1/fluid/network/underlay/" + manager_id;
        if(switch_id) url += "/leaf/" + switch_id
        else url += "/leaf"
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getSamplePhysical: function() {
        var url = location.origin + "/sample/physical";

        return http.get(url).then(function(res) {
            return res;
        })
    },
    getSampleLogical: function() {
        var url = location.origin + "/sample/logical";

        return http.get(url).then(function(res) {
            return res;
        })
    },
    getSampleNodeType: function() {
        var url = location.origin + "/sample/nodetype"

        return http.get(url).then(function(res) {
            return res;
        })
    }
}