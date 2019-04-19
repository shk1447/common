<template>
<div id="app-main">
    <div :class="open ? 'sidebar_left show' : 'sidebar_left'" ref="left_panel">
        <div class="header">
            <div class="header-logo">
                <a style="display:inline-block;padding:10px;">
                    <img src="/images/logo.png" alt="다우클라우드 로고">
                </a>
            </div>
        </div>
        <main-menu ref="main_menu"></main-menu>
    </div>
    <div class="content">
        <div class="header">
            <div class="header-bar">
                <section class="top_nav">
                    <ul class="header_nav" style="margin:0;padding:0;">
                        <li class="btn_logout">
                            <a style="display: inline-block;" @click="handleLogout">
                                <span class="ic ic_header_logout"></span>
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
        <topology-component v-if="activeIndex === '1'"></topology-component>
    </div>
    
    <create-node-modal ref="createNodeModal"></create-node-modal>
    <detail-node-modal ref="detailNodeModal"></detail-node-modal>
    <chart-modal ref="chartModal"></chart-modal>
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
import MainMenuPanel from './panel/MainMenuPanel.vue';
import ChartModal from './modal/ChartModal.vue'

import api from '../api/api.js'

export default {
    data () {
        return {
            activeIndex:'1',
            open:true
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
        "chart-modal" : ChartModal,
        "main-menu" : MainMenuPanel
        
    },
    methods: {
        handleLogout() {
            var me = this;
            me.$confirm("로그아웃 하시겠습니까?", "로그아웃", {
                confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'info'
            }).then(() => {
                this.$router.push('/') 
            }).catch(() => {

            });
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
    width:100%; height:60px;
}

#workspace {
    user-select: none;
    width:100%;
    height:100%;
    border:1px solid #d3d8de;
}

.content {
  height: calc(100%);
  overflow: hidden;
}

#app-main {
    width:100%;
    height:100%;
}

.sidebar_left {
  float: left;
  width: 0px;
  height: calc(100%);
  overflow: hidden;
  -webkit-transition: width .4s;
  transition: width .4s;
  background-color: rgb(242,249,255);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.sidebar_left.show {
    width:240px;
}

.handle {
  float: left;
  width: 15px;
  height: calc(100%);
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
}

.header-logo {
    width:240px;
    height: 100%;
    text-align:center; border-bottom:1px solid #2e343a; background:#3a424b;
}

.header-bar {
    display: flex;
}

.top_nav {
    position : absolute;
    top : 0;
    right : 0;
}

.header_nav {float:right;}
.header_nav li {float:left; border-left:1px solid #d3d8de;}
.header_nav li a:hover,
.header_nav li.btn_wide a,
.header_nav li.btn_normal a {padding:20px 20px 21px;}
.header_nav li.btn_logout a {padding:20px 20px 20px;}

.ic_header_logout {
    background : url(/images/ic.png) no-repeat 0 0
}
span.ic {display:inline-block; background:url(/images/ic.png) no-repeat 0 0; vertical-align:middle;}
span.ic_header_logout {width:17px; height:19px; background-position:-175px -25px;}
span.ic_snb_server {width:17px; height:17px; background-position:0px -25px;}
span.ic_snb_network {width:17px; height:17px; background-position:-25px -25px;}
span.ic_snb_storage {width:17px; height:17px; background-position:-50px -25px;}
span.ic_snb_project {width:17px; height:17px; background-position:-75px -25px;}

span.ic_snb_up {width:13px; height:7px; background-position:-50px 0;}
span.ic_snb_down {width:13px; height:7px; background-position:-75px 0;}
ul, ol {
    list-style:none;
    margin:0;
    padding:0;
}
span.txt, span.num, span.desc {vertical-align:middle;}
</style>