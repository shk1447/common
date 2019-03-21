<template>
<div id="app-main">
    <div class="header">
        <el-menu class="menu_bar" :default-active="activeIndex" mode="horizontal" @select="handleSelect" ref="menu_bar"
            background-color="rgb(41,50,63)" active-text-color="rgb(99,170,244)" text-color="rgb(114,119,126)">
            <el-menu-item index="1">Topology</el-menu-item>
            <el-menu-item index="2">Dashboard</el-menu-item>
            <el-menu-item index="3">DevLogs</el-menu-item>
            <el-menu-item index="4">Alarms</el-menu-item>
            <el-submenu index="5" style="float: right;">
                <template slot="title"><i class="el-icon-menu"></i></template>
                <el-menu-item index="5-2"><i class="el-icon-information"></i> About</el-menu-item>
                <el-menu-item index="5-3"><i class="el-icon-circle-close"></i> Logout</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
    <div :class="open ? 'sidebar_left show' : 'sidebar_left'" ref="left_panel">
        <stocker-list ref="stocker_list" v-if="activeIndex === '1'"></stocker-list>
    </div>
    <div class="handle" @click="handlePanelSlide">
        <i :class="open ? 'el-icon-caret-left' : 'el-icon-caret-right'" style="vertical-align: middle;"></i>
    </div>
    <div class="content">
        <topology-component v-if="activeIndex === '1'"></topology-component>
        <dashboard-component v-if="activeIndex === '2'"></dashboard-component>
        <log-component v-if="activeIndex === '3'"></log-component>
        <alarm-component v-if="activeIndex === '4'"></alarm-component>
    </div>
    
    <create-node-modal ref="createNodeModal"></create-node-modal>
    <detail-node-modal ref="detailNodeModal"></detail-node-modal>
    <context-menu ref="contextMenu"></context-menu>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import TopologyComponent from './viewer/TopologyComponent.vue'
import DashboardComponent from './viewer/DashboardComponent.vue'
import AlarmComponent from './viewer/AlarmComponent.vue'
import LogComponent from './viewer/LogComponent.vue'
import CreateNodeModal from './modal/CreateNodeModal.vue'
import DetailNodeModal from './modal/DetailNodeModal.vue'
import ContextMenu from './menu/ContextMenuComponent.vue'
import StockerList from './panel/StockerListPanel.vue';

import api from '../api/api.js'

export default {
    data () {
        return {
            isCollapse: true,
            code_list:[],
            data_list:{},
            activeIndex:'1',
            open:false
        }
    },
    components:{
        "topology-component" : TopologyComponent,
        "dashboard-component" : DashboardComponent,
        "log-component" : LogComponent,
        "alarm-component" : AlarmComponent,
        "create-node-modal" : CreateNodeModal,
        "detail-node-modal" : DetailNodeModal,
        "context-menu" : ContextMenu,
        "stocker-list" : StockerList
    },
    methods: {
        handlePanelSlide() {
            var me = this;
            me.open = !me.open;
        },
        handleSelect(key, keyPath) {
            var me = this;
            me.open = false;
            if(key === "5-3") {
                me.$confirm("로그아웃 하시겠습니까?", "로그아웃", {
                    confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'info'
                }).then(() => {
                    this.$router.push('/') 
                }).catch(() => {
                    me.$refs.menu_bar.activeIndex = me.activeIndex;
                });
            } else if ( key === '5-2') {
                me.$alert('<p>NAME : <strong>STOCKER</strong></p><p>VERSION : <strong>1.0.1</strong></p>', 'PRODUCT INFO',{dangerouslyUseHTMLString: true})
                me.$refs.menu_bar.activeIndex = me.activeIndex;
            } else {
                this.activeIndex = key;
            }
        },
        handlePopup(d) {
            var me = this;
            me.$refs[d.name].show(d.params);
        },
        handleMessage(d) {
            var me = this;
            me.$message({
                message:d.message,
                type:d.type
            });
        },
        handleNotify(d) {
            var me = this;
            me.$notify({
                message:d.message,
                type:d.type
            });
        }
    },
    beforeCreate(){
        
    },
    created() {
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        var me = this;
        common.events.on('popup', me.handlePopup);
        common.events.on('message', me.handleMessage);
        common.events.on('notify', me.handleNotify);
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        var me = this;
        common.events.off('popup', me.handlePopup);
        common.events.off('message', me.handleMessage);
        common.events.off('notify', me.handleNotify);
        console.log('destroyed')
    }
}
</script>
<style>

.header {
  height: 60px;
}


.content {
  height: calc(100% - 60px);
  overflow: hidden;
}

#app-main {
    width:100%;
    height:100%;
}

.sidebar_left {
  float: left;
  width: 0px;
  height: calc(100% - 60px);
  overflow: hidden;
  -webkit-transition: width .4s;
  transition: width .4s;
  background-color: rgb(242,249,255);
  border: 1px solid #d8dce5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.sidebar_left.show {
    width:300px;
}

.handle {
  float: left;
  width: 15px;
  height: calc(100% - 60px);
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
}

.menu_bar .el-menu-item {
    background-color:rgb(41,50,63) !important;
}

.menu_bar .el-submenu .el-submenu__title {
    background-color:rgb(41,50,63) !important;
}

.el-tabs__content {
    height: 100%;
    overflow: auto !important;
}
</style>