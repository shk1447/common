<template>
<div id="app-main">
    <div class="header">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" ref="menu_bar"
            background-color="#333" active-text-color="#fff" text-color="#909399">
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
    <div class="sidebar" ref="left_panel">
        
</div>
<div class="handle" @click="handlePanelSlide">

</div>
    <div class="content">
        <topology-component v-if="activeIndex === '1'"></topology-component>
        <dashboard-component v-if="activeIndex === '2'"></dashboard-component>
        <log-component v-if="activeIndex === '3'"></log-component>
        <alarm-component v-if="activeIndex === '4'"></alarm-component>
    </div>
    
    
    <!-- <div id="right-panel" ref="right_panel">
    </div> -->
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

export default {
    data () {
        return {
            isCollapse: true,
            code_list:[],
            data_list:{},
            activeIndex:'1'
        }
    },
    components:{
        "topology-component" : TopologyComponent,
        "dashboard-component" : DashboardComponent,
        "log-component" : LogComponent,
        "alarm-component" : AlarmComponent,
        "create-node-modal" : CreateNodeModal,
        "detail-node-modal" : DetailNodeModal,
        "context-menu" : ContextMenu
    },
    methods: {
        handlePanelSlide() {
            var me = this;
            $(me.$refs.left_panel).toggleClass('show');
        },
        handleSelect(key, keyPath) {
            var me = this;
            if(key === "5-3") {
                me.$confirm("로그아웃 하시겠습니까?", "로그아웃", {
                    confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'info'
                }).then(() => {
                    this.$router.push('/') 
                }).catch(() => {
                    me.$refs.menu_bar.activeIndex = me.activeIndex;
                });
            } else if ( key === '5-2') {
                me.$alert('<p>NAME : <strong>FLUID</strong></p><p>VERSION : <strong>1.0.1</strong></p>', 'PRODUCT INFO',{dangerouslyUseHTMLString: true})
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
        //$(me.$refs.left_panel).classed('show', true);
        // me.$loading({});

        // common.events.on("test", me.handleNotiify)

        // common.events.on('showRightPanel', function(d) {
        //     $(me.$refs.right_panel).toggle('slide');
        // })
        // setTimeout(function() {
        //     me.$loading({}).close();
        //     me.$message({
        //         message:'load complete',
        //         type:'info'
        //     });
        // },1000)
        // console.log('mounted')
        common.events.on('popup', me.handlePopup);
        common.events.on('message', me.handleMessage);
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
        console.log('destroyed')
    }
}
</script>
<style>

body, html {
	font-family: Poppins-Regular, sans-serif;
}

html, body {
  width: 100%;
  height: 100%;
}

.header {
  height: 60px;
  background: #2196F3;
}


.content {
  height: calc(100% - 60px);
  overflow: hidden;
}

#app-main {
    width:100%;
    height:100%;
}

.sidebar {
  float: left;
  width: 0px;
  height: calc(100% - 60px);
  background: #ffcdd2;
  overflow: auto;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.sidebar.show {
    width:300px;
}
.handle {
  float: left;
  width: 10px;
  height: calc(100% - 60px);
  background: #ddd;
  cursor: ew-resize;
}
</style>