<template>
<div :class="collapsed ? 'content-wrapper' : 'content-wrapper show'">
    <div class="toolbar-wrapper">
        <div class="tool left" v-if="init">
            <el-date-picker class="picker-custom"
            v-model="collection_date"
            type="date"
            @change="onChangeDate"
            placeholder="주가 분석날짜 선택">
            </el-date-picker>
        </div>
        <div class="tool left" @click="onStartCollection">
            <span style="font-size:1em;color:#2a2a2e;">
                <i :class="collection_status === 'stop' ? 'fas fa-play' : 'fas fa-pause'"></i>
            </span>
        </div>
        <div style="flex:1 1 100%; "></div>
        <div class="tool right" v-on:click="onFullScreen">
            <span style="font-size:1.2em;">
                <i class="fas fa-expand"></i>
            </span>
        </div>
    </div>
    <div class="handle-wrapper">
        <div :class="open ? 'sub_menu show' : 'sub_menu'" ref="left_panel">
            <sub-menu ref="sub_menu"></sub-menu>
        </div>
        <div class="handle" @click="handlePanelSlide">
            <i :class="open ? 'el-icon-caret-left' : 'el-icon-caret-right'" style="vertical-align: middle;"></i>
        </div>
    </div>
    <div id="view-space" @dragover="dragover" @drop="drop">
    </div>
</div>
</template>

<script>

import moment from 'moment';
import api from '../../api/api.js'
import SubLeftMenuPanel from '../panel/SubLeftMenuPanel.vue';
import { setTimeout } from 'timers';

export default {
    data () {
        return {
            init:false,
            open:false,
            collapsed:true,
            collection_date:new Date(),
            collection_status:'stop'
        }
    },
    components:{
        "sub-menu" :SubLeftMenuPanel
    },
    methods: {
        onStartCollection() {
            var param = {name:'stock',command:this.collection_status == 'stop' ? 'start':'stop'};
            var data = {"broadcast":false,"target":"collection", "method":"execute", "parameters":param};
            common.socket.emit('fromclient', data);
        },
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            me.$loading({})
            var transfer_data = e.dataTransfer.getData("node");
            var data = JSON.parse(transfer_data);
            if(data.type === 'date') {
                api.getRecommend(data).then(function(map) {
                    common.view.setRecommend(data, map, e);
                    me.$loading({}).close();
                }).catch(function(err) {
                    me.$loading({}).close();
                })
            } else {
                api.getFavoriteView(sessionStorage.getItem('user'), moment(this.collection_date).format("YYYY-MM-DD")).then(function(map) {
                    common.view.setFavorite(data,map,e);
                    me.$loading({}).close();
                }).catch(function(err) {
                    me.$loading({}).close();
                })
            }
        },
        onFullScreen() {
            if(document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                document.documentElement.webkitRequestFullScreen();
            }
        },
        handlePanelSlide() {
            var me = this;
            me.open = !me.open;
        },
        onChangeDate() {
            var date_text = moment(this.collection_date).format("YYYY-MM-DD")
            var param = {
                "target":"collection",
                "method":"modify",
                "parameters":{
                    "name":"stock",
                    "module_name":"Finance.dll",
                    "method_name":"CurrentStockInformation",
                    "action_type":"once",
                    "options":{
                        "date":date_text
                    }
                }
            };
            common.socket.emit('fromclient', param);
        },
        autoAnalysis() {
            this.collection_date = moment(this.collection_date).add(1, 'day');
            var date_text = moment(this.collection_date).format("YYYY-MM-DD")
            var param = {
                "target":"collection",
                "method":"modify",
                "parameters":{
                    "name":"stock",
                    "module_name":"Finance.dll",
                    "method_name":"CurrentStockInformation",
                    "action_type":"once",
                    "options":{
                        "date":date_text
                    }
                }
            };
            common.socket.emit('fromclient', param);
        }
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        var me = this;
        console.log('mounted');
        common.view.init('view-space');
        common.socket.connect().then(function(data) {
            console.log('connected');
            common.socket.on('collection.complete', function(data) {

                me.$notify({
                    message:"수집 완료",
                    type:"info"
                });

                // me.autoAnalysis();
                // setTimeout(function(){
                //     me.onStartCollection();
                // },500)
            })
            common.socket.on('collection.execute', function(data) {
                var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                common.socket.emit('fromclient', data);
            })
            common.socket.on('collection.modify', function(data) {
                var data = {"broadcast":true,"target":"collection", "method":"getlist", "parameters":{}};
                common.socket.emit('fromclient', data);
            })
            common.socket.on('collection.getlist', function(data) {
                if(data.result.length > 0) {
                    if(data.result[0].method_name === "CurrentStockInformation") {
                        me.init = true;
                        me.collection_date = typeof data.result[0].options === 'object' ? (data.result[0].options.date.includes("Invalid") ? new Date() : data.result[0].options.date) : 
                        (JSON.parse(data.result[0].options).date.includes("Invalid") ? new Date() :JSON.parse(data.result[0].options).date);
                        me.collection_status = data.result[0].status;
                        me.$refs.sub_menu.refresh();
                    } else {
                        me.init = true;
                        me.collection_status = data.result[0].status;
                    }
                } else {
                    me.init = false;
                    var param = {
                        "target":"collection",
                        "method":"create",
                        "parameters":{
                            "name":"stock",
                            "module_name":"Finance.dll",
                            "method_name":"AllStockInformation",
                            "action_type":"once"
                        }
                    }
                    common.socket.emit('fromclient', param);
                }
            })
            
            me.$nextTick(function(){
                var data = {"broadcast":false,"target":"collection", "method":"getlist", "parameters":{}};
                common.socket.emit('fromclient', data);
            })
        }).catch(function(err) {
            console.log(err);
        })

    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {
        common.socket.off('collection.modify').off('collection.getlist');
        common.socket.disconnect();
        common.view.uninit();
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>
<style>
.lasso {
    stroke-width: 1px;
    stroke: #3cace7;
    fill: rgba(20, 125, 255, 0.1);
    stroke-dasharray: 10 5;
}

.lasso_hovered {
    stroke: gray;
    fill: rgba(20, 125, 255, 0.2);
    stroke-dasharray: 0 0;
}

.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.1;
  shape-rendering: crispEdges;
}

.active {
  stroke: #000;
  stroke-width: 2px;
}

.node {
    cursor:move;
}

.node.selected {
    stroke:#ff7f0e;
    stroke-width:2;
}

.port {
    stroke:#999;
    stroke-width: 1px;
    visibility: collapse;
}

.port.visible {
    visibility: visible;
}

.port_hovered {
    stroke:#ff7f0e;
    fill:#ff7f0e;
}

.link_background {
    stroke: #fff;
    opacity: 0;
    stroke-width: 20;
    cursor: crosshair;
    fill:none;
}

.link_line {
    fill:none;
    pointer-events: none;
}

.link_anim {
    fill:none;
    pointer-events: none;
}

.drag_line {
    stroke:#ff7f0e;
    fill:none;
    pointer-events: none;
}

.content-wrapper {
    position: fixed;
    left: 50px;
    width:calc(100% - 50px);
    height:100%;
    overflow: hidden;
    -webkit-transition: left .3s, width .3s;
    transition: left .3s, width .3s;
}

.content-wrapper.show {
    width:calc(100% - 350px);
    left:350px;
}

.handle-wrapper {
    position: absolute;
    height: calc(100% - 50px);
}
.handle {
  float: left;
  width: 15px;
  height: 100%;
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
}


.sub_menu {
  float: left;
  width: 0px;
  height: 100%;
  overflow: hidden;
  -webkit-transition: width .4s;
  transition: width .4s;
  background-color: rgb(253,253,253);
  border: 1px solid #d8dce5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.sub_menu.show {
    width:300px;
}

#view-space {
    height: calc(100% - 50px);
    user-select: none;
}

.picker-custom {
    background-color:transparent;
}
.picker-custom>input {
    border:none;
    background-color:transparent;
}

.picker-custom>input:hover {
    border:none;
    background-color:transparent;
}

</style>