<template>
<div id="app-main">
    <div class="content">
        <div class="header">
            <div class="header-bar">
                <section class="top_nav">
                    <ul class="header_nav" style="margin:0;padding:0;">
                        <li class="btn_logout">
                            <a style="display: inline-block;" @click="handleLogout">
                                <font-awesome-icon icon="door-open"/>
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
    <context-menu ref="contextMenu"></context-menu>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import TopologyComponent from './viewer/TopologyComponent.vue'
import AlarmComponent from './viewer/AlarmComponent.vue'
import CreateNodeModal from './modal/CreateNodeModal.vue'
import DetailNodeModal from './modal/DetailNodeModal.vue'
import ContextMenu from './menu/ContextMenuComponent.vue'
import MainMenuPanel from './panel/MainMenuPanel.vue';

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
        "alarm-component" : AlarmComponent,
        "create-node-modal" : CreateNodeModal,
        "detail-node-modal" : DetailNodeModal,
        "context-menu" : ContextMenu,
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
    width:100%; height:58px;
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

ul, ol {
    list-style:none;
    margin:0;
    padding:0;
}
</style>