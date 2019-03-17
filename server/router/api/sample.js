const nodetype = [{"id":"spineSwitchs","type":"SPINE_SWITCH","desc":"Spine Switch","opcode":3,"icon":"/icons/switch.png"},{"id":"leafSwitchs","type":"LEAF_SWITCH","desc":"Leaf Switch","opcode":3,"icon":"/icons/switch.png"},{"id":"servers","type":"SERVER","desc":"Server","opcode":3,"icon":"/icons/switch.png"},{"id":"vNetworks","type":"vNETWORK","desc":"vNetwork","opcode":3,"icon":"/icons/switch.png"},{"id":"vSwitchs","type":"vSWITCH","desc":"vSwitch","opcode":3,"icon":"/icons/switch.png"},{"id":"vRouters","type":"vROUTER","desc":"vRouter","opcode":3,"icon":"/icons/switch.png"},{"id":"vServers","type":"vSERVER","desc":"vServer","opcode":3,"icon":"/icons/switch.png"}];

const overlay = {}
const underlay = {}

module.exports = {
    get: {
        "overlay" : function(req,res,next) {
            res.status(200).send(overlay);
        },
        "underlay" : function(req,res,next){
            res.status(200).send(underlay);
        },
        "nodetype" : function(req,res,next) {
            res.status(200).send(nodetype);
        }
    }
}