<template>
<div id="app-main">
    <div id="menu-bar">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" ref="menu_bar"
            background-color="#333" active-text-color="#fff" text-color="#909399">
            <el-submenu index="5" style="float: right;">
                <template slot="title"><i class="el-icon-menu"></i></template>
                <el-menu-item index="5-2"><i class="el-icon-information"></i> About</el-menu-item>
                <el-menu-item index="5-3"><i class="el-icon-circle-close"></i> Logout</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
    <div id="main-container">
        <topology-component v-if="activeIndex === '1'"></topology-component>
        <dashboard-component v-if="activeIndex === '2'"></dashboard-component>
        <log-component v-if="activeIndex === '3'"></log-component>
        <alarm-component v-if="activeIndex === '4'"></alarm-component>
    </div>
    <div id="left-panel" ref="left_panel">
        left menu panel
    </div>
    <!-- <div id="right-panel" ref="right_panel">
    </div> -->
    <create-node-modal ref="createNodeModal"></create-node-modal>
    <detail-node-modal ref="detailNodeModal"></detail-node-modal>
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
        "detail-node-modal" : DetailNodeModal
    },
    methods: {
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

#app-main {
    position: absolute;
    top:0px;
    left: 0px;
    width:100vw;
    height:100vh;
}

#menu-bar {
    position: absolute;
    width:100vw;
    height:60px;
}

#main-container {
    position: absolute;
    top:60px;
    left:10vw;
    width:90vw;
    height:calc(100vh - 60px);
}

#right-panel {
    position: absolute;
    opacity: .2;
    top:60px;
    width:20vw;
    height:calc(100vh - 70px);
    border-radius: 10px;
    transform: translateX(100vw);
    transition: all .75s ease;
    background: #333;
    margin-top:10px;
}

#right-panel.show {
    transform: translateX(80vw);
    opacity: 1;
}

#left-panel {
    position: absolute;
    top:65px;
    width:10vw;
    height:calc(100vh - 70px);
    border-radius: 10px;
    transition: all .75s ease;
    background: #333;
}

#left-panel.show {
    transform: translateX(80vw);
    opacity: 1;
}
  
</style>