const nodetype = [
    {
      "id": "SpineSwitch",
      "type": "SPINE_SWITCH",
      "desc": "Spine Switch",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "LeafSwitch",
      "type": "LEAF_SWITCH",
      "desc": "Leaf Switch",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "Server",
      "type": "SERVER",
      "desc": "Server",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "Fabric",
      "type": "FABRIC",
      "desc": "Fabric",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
        "id": "vNetwork",
        "type": "vNETWORK",
        "desc": "Virtual Network",
        "opcode": 3,
        "icon": "/icons/switch.png"
    },
    {
      "id": "vFabric",
      "type": "vFABRIC",
      "desc": "Virtual Fabric",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "vSwitch",
      "type": "vSWITCH",
      "desc": "Virtual Switch",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "vRouter",
      "type": "vROUTER",
      "desc": "Virtual Router",
      "opcode": 3,
      "icon": "/icons/switch.png"
    },
    {
      "id": "vServer",
      "type": "vSERVER",
      "desc": "Virtual Server",
      "opcode": 3,
      "icon": "/icons/switch.png"
    }
  ];

const overlay = {
    "vNetworks": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ],
    "vSwitchs": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "ports": [
          {
            "uuid": "string",
            "name": "string",
            "status": "string"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ],
    "vRouters": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ],
    "vServers": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ]
  }
const underlay = {
    "spineSwitch": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "ports": [
          {
            "uuid": "string",
            "name": "string",
            "status": "string"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ],
    "leafSwitch": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "ports": [
          {
            "uuid": "string",
            "name": "string",
            "status": "string"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ],
    "server": [
      {
        "uuid": "string",
        "name": "string",
        "status": 0,
        "links": [
          {
            "sourceUuid": "string",
            "targetUuid": "string",
            "speed": "1G"
          }
        ],
        "networkLayer": "L1",
        "opcode": 0
      }
    ]
  }

module.exports = {
    get: {
        "map" : function(req,res,next) {
            var sample_map = {"activeNodes":[{"x":535,"y":447,"name":"test2","uuid":"test2","type":"LEAF_SWITCH","status":2},{"x":944,"y":321,"name":"test3","uuid":"test3","type":"LEAF_SWITCH","status":5},{"x":536,"y":611,"name":"server01","uuid":"server01","type":"SERVER","status":1},{"x":711,"y":449,"name":"server02","uuid":"server02","type":"SERVER","status":5},{"x":945,"y":597,"name":"server03","uuid":"server03","type":"SERVER","status":4},{"x":1226,"y":321,"name":"server04","uuid":"server04","type":"SERVER","status":0},{"x":941,"y":181,"name":"vSwtich","uuid":"vSwtich","type":"vSWITCH","status":5},{"x":347,"y":321,"name":"vSwitch01","uuid":"vSwitch01","type":"vSWITCH","status":2},{"x":346,"y":180,"name":"vNetwork","uuid":"vNetwork","type":"vNETWORK","status":0},{"x":1221,"y":182,"name":"vRouter","uuid":"vRouter","type":"vROUTER","status":1},{"x":1463,"y":178,"name":"vServer","uuid":"vServer","type":"vSERVER","status":0},{"x":1416,"y":303,"name":"vServer01","uuid":"vServer01","type":"vSERVER","status":4},{"x":1219,"y":50,"name":"vServer02","uuid":"vServer02","type":"vSERVER","status":0},{"x":1353,"y":78,"name":"vServer03","uuid":"vServer03","type":"vSERVER","status":2},{"x":147,"y":449,"name":"vServer04","uuid":"vServer04","type":"vSERVER","status":4},{"x":346,"y":450,"name":"vRouter01","uuid":"vRouter01","type":"vROUTER","status":3},{"x":345,"y":605,"name":"vServer05","uuid":"vServer05","type":"vSERVER","status":4},{"x":532,"y":321,"name":"spine_switch","uuid":"spine_switch","type":"SPINE_SWITCH","status":1},{"x":1218,"y":572,"name":"서버01","uuid":"서버01","type":"SERVER","status":1},{"x":-215.4938818663286,"y":-712.9381302500658,"name":"멀리있는서버","uuid":"멀리있는서버","type":"SERVER","status":1},{"x":519.687248802792,"y":-722.1450475600747,"name":"멀리있는스위치","uuid":"멀리있는스위치","type":"LEAF_SWITCH","status":0}],"activeLinks":[{"sourceUuid":"test2","targetUuid":"server01","speed":23},{"sourceUuid":"test2","targetUuid":"server02","speed":80},{"sourceUuid":"test3","targetUuid":"server03","speed":13},{"sourceUuid":"test3","targetUuid":"server04","speed":64},{"sourceUuid":"test3","targetUuid":"vSwtich","speed":54},{"sourceUuid":"test2","targetUuid":"vSwitch01","speed":49},{"sourceUuid":"vSwitch01","targetUuid":"vNetwork","speed":45},{"sourceUuid":"vNetwork","targetUuid":"vSwtich","speed":66},{"sourceUuid":"vRouter","targetUuid":"vServer01","speed":56},{"sourceUuid":"vRouter","targetUuid":"vServer","speed":61},{"sourceUuid":"vSwtich","targetUuid":"vRouter","speed":92},{"sourceUuid":"vRouter","targetUuid":"vServer02","speed":21},{"sourceUuid":"vRouter","targetUuid":"vServer03","speed":41},{"sourceUuid":"vSwitch01","targetUuid":"vRouter01","speed":73},{"sourceUuid":"vRouter01","targetUuid":"vServer04","speed":76},{"sourceUuid":"vRouter01","targetUuid":"vServer05","speed":32},{"sourceUuid":"spine_switch","targetUuid":"test2","speed":24},{"sourceUuid":"spine_switch","targetUuid":"test3","speed":36},{"sourceUuid":"test3","targetUuid":"서버01","speed":9},{"sourceUuid":"spine_switch","targetUuid":"멀리있는스위치","speed":79},{"sourceUuid":"멀리있는서버","targetUuid":"멀리있는스위치","speed":20}]};

            res.status(200).send(sample_map);
        },
        "controller" : function(req,res,next) {
            var sample_list = [{
                "uuid" : "uuid01",
                "name" : "Fluid SDN01",
                "desc" : "Fluid SDN01",
                "ineternalAddress" : "컨트롤러 연결 내부 주소",
                "externalAddress" : "컨트롤러 연결 주소",
                "adminId" : "컨트롤러 연결 아이디",
                "adminPw" : "컨트롤러 연결 암호",
                "port" : "컨트롤러 연결 포트",
                "parameter" : "컨트롤러 세부 옵션",
                "fluidCSDNType" : "컨트롤러 유형"
            },{
                "uuid" : "uuid02",
                "name" : "Fluid SDN02",
                "desc" : "Fluid SDN02",
                "ineternalAddress" : "컨트롤러 연결 내부 주소",
                "externalAddress" : "컨트롤러 연결 주소",
                "adminId" : "컨트롤러 연결 아이디",
                "adminPw" : "컨트롤러 연결 암호",
                "port" : "컨트롤러 연결 포트",
                "parameter" : "컨트롤러 세부 옵션",
                "fluidCSDNType" : "컨트롤러 유형"
            },{
                "uuid" : "uuid03",
                "name" : "Fluid SDN03",
                "desc" : "Fluid SDN03",
                "ineternalAddress" : "컨트롤러 연결 내부 주소",
                "externalAddress" : "컨트롤러 연결 주소",
                "adminId" : "컨트롤러 연결 아이디",
                "adminPw" : "컨트롤러 연결 암호",
                "port" : "컨트롤러 연결 포트",
                "parameter" : "컨트롤러 세부 옵션",
                "fluidCSDNType" : "컨트롤러 유형"
            }]

            res.status(200).send(sample_list);
        },
        "overlay" : function(req,res,next) {
            res.status(200).send(overlay);
        },
        "underlay" : function(req,res,next){
            res.status(200).send(underlay);
        },
        "nodetype" : function(req,res,next) {
            res.status(200).send(nodetype);
        },
        "schema" : function(req,res,next) {
            var schema = {
                "FluidCSDNController" : {
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
                "vFabric" : {
                    "uuid" : "Virtual Fabric UUID",
                    "name" : "Virtual Fabric 이름",
                    "description" : "Virtual Fabric 설명",
                    "ports" : "Virtual Fabric 포트",
                    "address" : "Virtual Fabric 주소",
                    "status" : "Virtual Fabric 상태",
                    "state" : "Virtual Fabric 작업 상태",
                    "networkLayer" : "네트워크 영역구분"
                },
                "vRouter" : {
                    "uuid" : "Virtual Router UUID",
                    "nodeId" : "Virtual Router 노드 ID",
                    "name" : "Virtual Router 이름",
                    "desc" : "Virtual Router 설명",
                    "networkLayer" : "네트워크 영역구분"
                },
                "vSwitch" : {
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