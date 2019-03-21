const _ = require('lodash');
const axios = require('axios');

var path = {
    "controller":"/v1/fluid/net/ctrl",
    "overlay":"/v1/fluid/net/{ctrlUuid}/olmap",
    "underlay":"/v1/fluid/net/{ctrlUuid}/ulmap"
}

module.exports = {
    get: {
        "controller": async function(req,res,next) {
            var req_url = process.env.external_url + path.controller;
            let response = await axios.get(req_url);

            res.status(200).send(response.data);
        },
        "underlay" : async function(req,res,next){
            var req_url = process.env.external_url + path.underlay.replace("{ctrlUuid}", req.query.uuid);
            let response = await axios.get(req_url);

            res.status(200).send(response.data);
        },
        "overlay" : async function(req,res,next) {
            var req_url = process.env.external_url + path.overlay.replace("{ctrlUuid}", req.query.uuid);
            let response = await axios.get(req_url);

            res.status(200).send(response.data);
        }
    }
}