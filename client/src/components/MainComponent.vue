<template>
<div id="app-main">
    
    <topology-component ref="view_content" v-if="active_content === 'view'"></topology-component>
    <chart-component ref="chart_content" v-if="active_content === 'chart'"></chart-component>
    
    <main-menu :collapse="onCollapse" :itemClick="onItemClick"></main-menu>
    
    <create-node-modal ref="createNodeModal"></create-node-modal>
    <detail-node-modal ref="detailNodeModal"></detail-node-modal>
    <chart-modal ref="chartModal"></chart-modal>
    <context-menu ref="contextMenu"></context-menu>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import TopologyComponent from './viewer/TopologyComponent.vue'
import ChartComponent from './viewer/ChartComponent.vue'
import CreateNodeModal from './modal/CreateNodeModal.vue'
import DetailNodeModal from './modal/DetailNodeModal.vue'
import ChartModal from './modal/ChartModal.vue'
import ContextMenu from './menu/ContextMenuComponent.vue'
import MainMenuPanel from './panel/MainMenuPanel.vue';

import api from '../api/api.js'

export default {
    data () {
        return {
            active_content:'view',
            open:true
        }
    },
    components:{
        "topology-component" : TopologyComponent,
        "chart-component" : ChartComponent,
        "create-node-modal" : CreateNodeModal,
        "detail-node-modal" : DetailNodeModal,
        "chart-modal" : ChartModal,
        "context-menu" : ContextMenu,
        "main-menu" : MainMenuPanel
    },
    methods: {
        onCollapse(collapsed) {
            this.$refs[this.active_content + "_content"].collapsed = collapsed;
        },
        onHandlePage(d) {
            this.active_content = d.page_name;
            this.$nextTick(function () {
                this.$refs[this.active_content + "_content"].selected_item.category = d.params.id;
                this.$refs[this.active_content + "_content"].selected_item.name = d.params.name;
                this.$refs[this.active_content + "_content"].refresh();
            })
        },
        onItemClick(event, item) {
            this.active_content = item.title.toLowerCase();
        },
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
        common.events.on('notify', me.onhandleNotify);
        common.events.on('onHandlePage', me.onHandlePage)
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
        common.events.off('onHandlePage', me.onHandlePage)
        console.log('destroyed')
    }
}
</script>
<style>

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