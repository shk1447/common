const sample = require('../model/sample');

const logical = [{"type":"KaloomFabric","controller":{"address":"192.168.2.16","port":"443","adminId":"admin"},"hostName":"","version":"0.2.0","managementVlan":"1234","fabricHostPrefix":"10.10.10.0","controllers":3,"quorum":3,"vFabrics":[{"objectUuid":"6","vSwitchs":[{"leftSwitchUuid":"501adb43-d8dc-4a10-9e59-136e513e180a","rightSwitchUuid":"218541de-2a69-467c-84b0-436c6fd06f42","networkLayer":"L3","interfaces":[{"sourceUuid":"501adb43-d8dc-4a10-9e59-136e513e180a","state":0,"address":{"ip":"192.168.0.1","addrType":"IPv4"},"interfaceType":"GATEWAY"},{"sourceUuid":"218541de-2a69-467c-84b0-436c6fd06f42","state":0,"address":{"ip":"172.10.0.1","addrType":"IPv4"},"interfaceType":"GATEWAY"}],"uuid":"c09c5e47-16ce-414e-8571-14704fbf7c2d","name":"Pribit vRouter","desc":"L3 Router"},{"arpSuppressionEnable":true,"noSuppressionEnable":false,"macAddressTableAgingEnable":false,"arpTableAgingTime":300,"noTableAgingTime":300,"macAddressTableAgigTime":300,"layer":"L2","allocated":30,"unallocable":10,"upLink":{"topNodeUuid":"6","bottomNodeUuid":"501adb43-d8dc-4a10-9e59-136e513e180a","state":1},"uuid":"501adb43-d8dc-4a10-9e59-136e513e180a","name":"Pribit vFabric2 Switch1","desc":"l2 Switch1"},{"arpSuppressionEnable":true,"noSuppressionEnable":false,"macAddressTableAgingEnable":false,"arpTableAgingTime":300,"noTableAgingTime":300,"macAddressTableAgigTime":300,"layer":"L2","allocated":30,"unallocable":10,"upLink":{"topNodeUuid":"6","bottomNodeUuid":"218541de-2a69-467c-84b0-436c6fd06f42","state":1},"uuid":"218541de-2a69-467c-84b0-436c6fd06f42","name":"Pribit vFabric2 Switch2","desc":"l2 Switch2"}],"ports":35,"address":"192.168.2.23","state":"CREATED","networkLayer":"L1","uuid":"6","name":"vFabric2","status":"CREATED","desc":""},{"objectUuid":"","vSwitchs":[{"arpSuppressionEnable":true,"noSuppressionEnable":false,"macAddressTableAgingEnable":false,"arpTableAgingTime":300,"noTableAgingTime":300,"macAddressTableAgigTime":300,"layer":"L2","allocated":30,"unallocable":5,"upLink":{"topNodeUuid":"5","bottomNodeUuid":"54358b52-6417-4ee4-8847-e0740a6c29a4","state":1},"uuid":"54358b52-6417-4ee4-8847-e0740a6c29a4","name":"Pribit vFabric Switch2","desc":"l2 Switch2"},{"arpSuppressionEnable":true,"noSuppressionEnable":false,"macAddressTableAgingEnable":false,"arpTableAgingTime":300,"noTableAgingTime":300,"macAddressTableAgigTime":300,"layer":"L2","allocated":30,"unallocable":10,"upLink":{"topNodeUuid":"5","bottomNodeUuid":"5b38187fe-02be-4e76-84a3-2151088610d2","state":1},"uuid":"b38187fe-02be-4e76-84a3-2151088610d2","name":"Pribit vFabric Switch3","desc":"l2 Switch3"},{"arpSuppressionEnable":true,"noSuppressionEnable":false,"macAddressTableAgingEnable":false,"arpTableAgingTime":300,"noTableAgingTime":300,"macAddressTableAgigTime":300,"layer":"L2","allocated":30,"unallocable":10,"upLink":{"topNodeUuid":"5","bottomNodeUuid":"1b4fbf91-f9b1-4aef-a666-ed100bdfc512","state":1},"uuid":"1b4fbf91-f9b1-4aef-a666-ed100bdfc512","name":"Pribit vFabric Switch1","desc":"l2 Switch1"}],"ports":40,"address":"192.168.2.22","state":"CREATED","networkLayer":"L1","uuid":"5","name":"vFabric1","status":"STATUS","desc":""}],"networkLayer":"L1","uuid":"fabric-123","name":"fabric-123","status":1}];

const physical = [{"hostName":"spine2.pribit.com","deviceUuid":"622692978013","deviceMac":"00:09:fb:64:cd:48","state":0,"adminState":1,"nodeType":"SPINE_SWITCH","nodeSpec":{"cpu":"Intel 2.2 GHz Intel Core i7 ","mem":"16GB","disk":"500GB","arch":"x86","os":"Redhat Atomic"},"nodeSubTree":[{"hostName":"leaf1.pribit.com","deviceUuid":"622692978020","deviceMac":"00:09:fb:64:cd:31","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"07a96b48-b2f2-4d63-b0fa-268bf6436ef0","bottomNodeUuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","state":1,"speed":"18G","linkMode":"FullDuplex"}],"uuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","name":"Leaf Switch1","desc":"Leaf Switch1","status":1,"type":"KALOOM"},{"hostName":"leaf4.pribit.com","deviceMac":"00:09:fb:64:cd:34","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"07a96b48-b2f2-4d63-b0fa-268bf6436ef0","bottomNodeUuid":"9b78d512-ea0f-41c7-9cb2-96bc31e97a55","state":1,"speed":"99G","linkMode":"FullDuplex"}],"uuid":"9b78d512-ea0f-41c7-9cb2-96bc31e97a55","name":"Leaf Switch4","desc":"Leaf Switch4","status":1,"type":"KALOOM"},{"hostName":"leaf2.pribit.com","deviceMac":"00:09:fb:64:cd:32","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"07a96b48-b2f2-4d63-b0fa-268bf6436ef0","bottomNodeUuid":"efac93fe-428d-406e-8408-751d796b71e0","state":1,"speed":"33G","linkMode":"FullDuplex"}],"uuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","name":"Leaf Switch2","desc":"Leaf Switch2","status":1,"type":"KALOOM"},{"hostName":"leaf3.pribit.com","deviceMac":"00:09:fb:64:cd:33","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"07a96b48-b2f2-4d63-b0fa-268bf6436ef0","bottomNodeUuid":"dd595c22-8bf1-48b5-99d9-5aba20eb8243","state":1,"speed":"100G","linkMode":"FullDuplex"}],"uuid":"dd595c22-8bf1-48b5-99d9-5aba20eb8243","name":"Leaf Switch3","desc":"Leaf Switch3","status":1,"type":"KALOOM"}],"nodePorts":[{"uuid":"daf7b2f9-a497-4f06-bf76-7765aeb0e011","name":"spine port3","desc":"spine port3","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"587f3f67-6321-4e94-ac80-3b816c6eb202","name":"spine port5","desc":"spine port5","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"6c54ae90-330b-401a-92c5-3c6b0c04d073","name":"spine port1","desc":"spine port1","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"1a5ef5b8-0ca7-4b1d-bfde-7d2af9cb2fd6","name":"spine port4","desc":"spine port4","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"af643764-89e1-45c2-8f98-90a598b2fa0d","name":"spine port2","desc":"spine port2","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"a6c0b1f3-7fb6-4c47-af65-1acb6688bfc0","name":"spine port6","desc":"spine port6","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}}],"metadata":{},"allocated":0,"unallocable":0,"uuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","name":"SpineSwitch2","desc":"Spine Switch","status":1},{"hostName":"spine1.pribit.com","deviceUuid":"622692978016","deviceMac":"00:09:fb:64:cd:60","state":0,"adminState":1,"nodeType":"SPINE_SWITCH","nodeSpec":{"cpu":"Intel 2.2 GHz Intel Core i7 ","mem":"16GB","disk":"500GB","arch":"x86","os":"Redhat Atomic"},"nodeSubTree":[{"hostName":"leaf2.pribit.com","deviceMac":"00:09:fb:64:cd:32","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","bottomNodeUuid":"efac93fe-428d-406e-8408-751d796b71e0","state":1,"speed":"55G","linkMode":"FullDuplex"}],"uuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","name":"Leaf Switch2","desc":"Leaf Switch2","status":1,"type":"KALOOM"},{"hostName":"leaf3.pribit.com","deviceMac":"00:09:fb:64:cd:33","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","bottomNodeUuid":"dd595c22-8bf1-48b5-99d9-5aba20eb8243","state":1,"speed":"6G","linkMode":"FullDuplex"}],"uuid":"dd595c22-8bf1-48b5-99d9-5aba20eb8243","name":"Leaf Switch3","desc":"Leaf Switch3","status":1,"type":"KALOOM"},{"hostName":"leaf4.pribit.com","deviceMac":"00:09:fb:64:cd:34","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","bottomNodeUuid":"9b78d512-ea0f-41c7-9cb2-96bc31e97a55","state":1,"speed":"77G","linkMode":"FullDuplex"}],"uuid":"9b78d512-ea0f-41c7-9cb2-96bc31e97a55","name":"Leaf Switch4","desc":"Leaf Switch4","status":1,"type":"KALOOM"},{"hostName":"leaf1.pribit.com","deviceUuid":"622692978020","deviceMac":"00:09:fb:64:cd:31","state":0,"adminState":1,"nodeType":"LEAF_SWITCH","nodeSpec":{"cpu":"Intel 2.6 GHz Intel Core i7 ","mem":"32GB","disk":"100GB","arch":"x86","os":"Redhat Atomic"},"metadata":{},"allocated":10,"unallocable":10,"uplinks":[{"topNodeUuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","bottomNodeUuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","state":1,"speed":"44G","linkMode":"FullDuplex"}],"uuid":"c2cdc296-4359-45e7-a988-9017d4727e1d","name":"Leaf Switch1","desc":"Leaf Switch1","status":1,"type":"KALOOM"}],"nodePorts":[{"uuid":"af643764-89e1-45c2-8f98-90a598b2fa0d","name":"spine port2","desc":"spine port2","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"1a5ef5b8-0ca7-4b1d-bfde-7d2af9cb2fd6","name":"spine port4","desc":"spine port4","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"daf7b2f9-a497-4f06-bf76-7765aeb0e011","name":"spine port3","desc":"spine port3","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"587f3f67-6321-4e94-ac80-3b816c6eb202","name":"spine port5","desc":"spine port5","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"a6c0b1f3-7fb6-4c47-af65-1acb6688bfc0","name":"spine port6","desc":"spine port6","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}},{"uuid":"6c54ae90-330b-401a-92c5-3c6b0c04d073","name":"spine port1","desc":"spine port1","interfaceType":"PORT","link":{"state":0,"speed":"10G"},"encapsulationType":"VLAN","taggedFlag":false,"vlanId":100,"adminState":"UP","operationState":"UP","metadata":{}}],"metadata":{},"allocated":0,"unallocable":0,"uuid":"1df61cdc-2f11-422e-82ce-5eea7c152c67","name":"SpineSwitch1","desc":"Spine Switch","status":1}];

const nodetype = [{"type":"SPINE_SWITCH","desc":"Spine Switch","opcode":3},{"type":"LEAF_SWITCH","desc":"Leaf Switch","opcode":3},{"type":"SERVER","desc":"Server","opcode":3},{"type":"vFABRIC","desc":"vFabric","opcode":3},{"type":"vSWITCH","desc":"vSwitch","opcode":3},{"type":"vSERVER","desc":"vServer","opcode":3}];

module.exports = {
    get: {
        "logical" : function(req,res,next) {
            res.status(200).send(logical);
        },
        "physical" : function(req,res,next){
            res.status(200).send(physical);
        },
        "nodetype" : function(req,res,next) {
            res.status(200).send(nodetype);
        }
    }
}