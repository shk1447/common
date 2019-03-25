const _ = require('lodash');

const nodetype = [{"name":"SDN","id":8,"desc":"Software Defined Network","icon":"/icons/switch.png"},{"name":"SPINE_SWITCH","id":1,"desc":"Spine Switch","icon":"/icons/switch.png"},{"name":"LEAF_SWITCH","id":2,"desc":"Leaf Switch","icon":"/icons/switch.png"},{"name":"L2_SWITCH","id":3,"desc":"L2 Switch","icon":"/icons/switch.png"},{"name":"L3_ROUTER","id":5,"desc":"L3 Router","icon":"/icons/switch.png"},{"name":"SERVER","id":6,"desc":"Server","icon":"/icons/switch.png"},{"name":"vNetwork","id":9,"desc":"Virtual Network","icon":"/icons/switch.png"},{"name":"vServer","id":7,"desc":"Virtual Server","icon":"/icons/switch.png"}]

const overlay = {"vNetwork":[{"uuid":"v_network01","name":"v_network01","status":0,"links":[{"sourceUuid":"v_network01","targetUuid":"l2_switch01","speed":"1G"}],"networkLayer":"L1","opcode":0}],"L2_SWITCH":[{"uuid":"l2_switch01","name":"l2_switch01","status":0,"links":[{"sourceUuid":"l2_switch01","targetUuid":"l3_router01","speed":"1G"},{"sourceUuid":"l2_switch01","targetUuid":"v_server01","speed":"1G"}],"ports":[{"uuid":"l2_switch_port01","name":"l2_switch_port01","status":"0"}],"networkLayer":"L1","opcode":0}],"L3_ROUTER":[{"uuid":"l3_router01","name":"l3_router01","status":0,"links":[],"networkLayer":"L1","opcode":0}],"vServer":[{"uuid":"v_server01","name":"v_server01","status":0,"links":[],"networkLayer":"L1","opcode":0}]}

const underlay = {"SPINE_SWITCH":[{"uuid":"spine_switch01","name":"spine_switch01","status":0,"links":[{"sourceUuid":"spine_switch01","targetUuid":"leaf_switch01","speed":"1G"},{"sourceUuid":"sdn01","targetUuid":"spine_switch01","speed":"1G"}],"ports":[{"uuid":"spine_port01","name":"spine_port01","status":"0"}],"networkLayer":"L1","opcode":0}],"LEAF_SWITCH":[{"uuid":"leaf_switch01","name":"leaf_switch01","status":0,"links":[{"sourceUuid":"leaf_switch01","targetUuid":"server01","speed":"1G"}],"ports":[{"uuid":"leaf_port01","name":"leaf_port01","status":"0"}],"networkLayer":"L1","opcode":0}],"SERVER":[{"uuid":"server01","name":"server01","status":0,"links":[],"networkLayer":"L1","opcode":0}]}

const controller = [{
  "uuid" : "sdn01",
  "name" : "Fluid SDN01",
  "desc" : "Fluid SDN01",
  "ineternalAddress" : "컨트롤러 연결 내부 주소",
  "externalAddress" : "컨트롤러 연결 주소",
  "adminId" : "컨트롤러 연결 아이디",
  "adminPw" : "컨트롤러 연결 암호",
  "port" : "컨트롤러 연결 포트",
  "parameter" : "컨트롤러 세부 옵션",
  "fluidCSDNType" : "컨트롤러 유형"
}]

module.exports = {
  post : {
    "overlay" : function(req,res,next) {
      var response = {};
      var controller_list = req.body.map((d) => { return d.uuid });
      _.each(controller_list, (v,i) => {
        response[v] = overlay;
      })
      res.status(200).send(response);
    },
    "underlay" : function(req,res,next){
      var response = {};
      var controller_list = req.body.map((d) => { return d.uuid });
      _.each(controller_list, (v,i) => {
        response[v] = underlay;
      })
      res.status(200).send(response);
    }
  },
  get: {
    "controller" : function(req,res,next) {
      res.status(200).send(controller);
    },
    "nodetype" : function(req,res,next) {
        res.status(200).send(nodetype);
    },
    "schema" : function(req,res,next) {
        var schema = {
            "SDN" : {
                "name" : "컨트롤러 이름",
                "uuid" : "컨트롤러 UUID",
                "desc" : "컨트롤러 설명",
                "ineternalAddress" : "컨트롤러 연결 내부 주소",
                "externalAddress" : "컨트롤러 연결 주소",
                "adminId" : "컨트롤러 연결 아이디",
                "adminPw" : "컨트롤러 연결 암호",
                "port" : "컨트롤러 연결 포트",
                "parameter" : "컨트롤러 세부 옵션",
                "fluidCSDNType" : "컨트롤러 유형"
            },
            "SpineSwitch" : {
                "uuid" : "Spine Swtich UUID",
                "name" : "Spine Switch 이름",
                "desc" : "Spine Switch 설명",
                "status" : "Spine Switch 상태",
                "hostName" : "Spine Switch 호스트이름",
                "deviceUuid" : "Spine Switch 장비 UUID",
                "deviceMac" : "Spine Switch Mac 정보"
            },
            "LeafSwitch" : {
                "uuid" : "Leaf Switch UUID",
                "name" : "Leaf Switch 이름",
                "desc" : "Leaf Switch 설명",
                "status" : "Leaf Switch 상태",
                "allocated" : "할당된 포트 수",
                "unallocable" : "미할당된 포트 수",
                "hostName" : "Leaf Switch 호스트이름",
                "deviceUuid" : "Leaf Switch 장비 UUID",
                "deviceMac" : "Leaf Switch 장비 MAC"
            },
            "Fabric" : {
                "uuid" : "Fabric UUID",
                "name" : "Fabric 이름",
                "description" : "Fabric 설명",
                "hostName" : "Fabric 호스트 이름",
                "version" : "Fabric 버전 정보",
                "managementPrefix" : "Fabric 네트워크 관리대역",
                "controllers" : "Fabric 컨트롤러",
                "status" : "Fabric 상태",
                "networkLayer" : "네트워크 영역구분"
            },
            "vNetwork" : {
                "uuid" : "Virtual Fabric UUID",
                "name" : "Virtual Fabric 이름",
                "description" : "Virtual Fabric 설명",
                "ports" : "Virtual Fabric 포트",
                "address" : "Virtual Fabric 주소",
                "status" : "Virtual Fabric 상태",
                "state" : "Virtual Fabric 작업 상태",
                "networkLayer" : "네트워크 영역구분"
            },
            "L3_ROUTER" : {
                "uuid" : "Virtual Router UUID",
                "nodeId" : "Virtual Router 노드 ID",
                "name" : "Virtual Router 이름",
                "desc" : "Virtual Router 설명",
                "networkLayer" : "네트워크 영역구분"
            },
            "L2_SWITCH" : {
                "uuid" : "Virtual Switch UUID",
                "nodeId" : "Virtual Switch 노드 ID",
                "name" : "Virtual Switch 이름",
                "desc" : "Virtual Switch 설명",
                "networkLayer" : "네트워크 영역구분"
            }
        }
        res.status(200).send(schema);
      }
    }
}