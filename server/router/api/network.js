const _ = require('lodash');
const axios = require('axios');

var path = {
    "test":"",
    "controller":"/v1/fluid/network/underlay/manager",
    "parent_switch":"/v1/fluid/network/underlay/{MANAGER_ID}/spine/{UUID}",
    "child_switch":"/v1/fluid/network/underlay/{MANAGER_ID}/leaf/{UUID}",

    "sdn":"/v1/fluid/network/overlay/sdn",
    "vFabric":"/v1/fluid/network/overlay/{SDN_ID}/vnet/{VFABRIC_ID}",
    "vSwitch":"/v1/fluid/network/overlay/{SDN_ID}/vnet/{VFABRIC_ID}/switch/{UUID}",
    "vRouter":"/v1/fluid/network/overlay/{SDN_ID}/vnet/{VFABRIC_ID}/router/{UUID}",

    "subnet":"/v1/fluid/network/overlay/{SDN_ID}/vnet/{VFABRIC_ID}/switch/{UUID}/subnet",
    "interface":"/v1/fluid/network/overlay/{SDN_ID}/vnet/{VFABRIC_ID}/switch/{UUID}/interface"
}

module.exports = {
    get: {
        "logical/list": async function(req,res,next) {
            var req_url = process.env.external_url + path.test;
            let response = await axios.get(req_url);

            res.status(200).send(response.data);
        },
        "logical" : async function(req,res,next) {
            res.status(200).send();
        },
        "physical/list" : async function(req,res,next){
            res.status(200).send();
        },
        "physical" : async function(req,res,next){
            res.status(200).send();
        },
        "nodetype" : async function(req,res,next) {
            res.status(200).send();
        }
    }
}