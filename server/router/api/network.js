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
        "controller": function(req,res,next) {
            var req_url = process.env.controller_url + path.controller;
            try {
                axios.get(req_url,{timeout:1000}).then((response) => {
                    if(response.data && response.data.objects && response.data.objects.CONTROLLER) {
                        res.status(200).send(response.data.objects.CONTROLLER);
                    } else {
                        res.status(500).send();
                    }
                }).catch((error) => {
                    res.status(500).send(error);
                })
            } catch (error) {
                res.status(500).send(error);
            }
        },
        "detail" : async function(req,res,next) {

            res.status(200).send();
        }
    },
    post: {
        "underlay" : function(req,res,next){
            var req_url = process.env.underlay_url + path.underlay.replace("{ctrlUuid}", req.body.uuid);
            try {
                axios.get(req_url,{timeout:1000}).then((response) => {
                    if(response.data && response.data.objects) {
                        res.status(200).send(response.data.objects);
                    } else {
                        res.status(500).send();
                    }
                }).catch((error) => {
                    res.status(500).send(error);
                })
            } catch (error) {
                res.status(500).send(error);
            }
        },
        "overlay" : function(req,res,next) {
            var req_url = process.env.overlay_url + path.overlay.replace("{ctrlUuid}", req.body.uuid);
            try {
                axios.get(req_url,{timeout:1000}).then((response) => {
                    if(response.data && response.data.objects) {
                        res.status(200).send(response.data.objects);
                    } else {
                        res.status(500).send();
                    }
                }).catch((error) => {
                    res.status(500).send(error);
                })
            } catch (error) {
                res.status(500).send(error);
            }
        }
    }
}