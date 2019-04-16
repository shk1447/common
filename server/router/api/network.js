const _ = require('lodash');
const axios = require('axios');

var path = {
    "controller":"/v1/fluid/net/ctrl",
    "overlay":"/v1/fluid/net/{ctrlUuid}/olmap",
    "underlay":"/v1/fluid/net/{ctrlUuid}/ulmap",
    "detail": {
        "SDN" :"/v1/fluid/net/ctrl/{ctrlUuid}",
        "SPINE_SWITCH":"/v1/fluid/net/{ctrlUuid}/ul/spine/{uuid}",
        "LEAF_SWITCH":"/v1/fluid/net/{ctrlUuid}/ul/leaf/{uuid}",
        "SERVER": "",
        "L2_SWITCH":"",
        "L3_ROUTER":"",
        "vNetwork":"",
        "vServer":"",

    }
}

module.exports = {
    get: {
        "controller": async function(req,res,next) {
            var req_url = process.env.external_url + path.controller;
            let response = await axios.get(req_url);

            res.status(200).send(response.data);
        },
        "detail" : async function(req,res,next) {

            res.status(200).send();
        }
    },
    post: {
        "underlay" : async function(req,res,next){
            var req_url = process.env.underlay_url + path.underlay.replace("{ctrlUuid}", req.body.uuid);
            try {
                let response = await axios.get(req_url);
                res.status(200).send(response.data.objects);
            } catch (error) {
                res.status(500).send(error);
            }
        },
        "overlay" : async function(req,res,next) {
            var req_url = process.env.overlay_url + path.overlay.replace("{ctrlUuid}", req.body.uuid);
            try {
                let response = await axios.get(req_url);   
                res.status(200).send(response.data.objects);
            } catch (error) {
                res.status(500).send(error);
            }
        }
    }
}