<template>
<div id="app-main">
    <div id="menu-bar">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">Topology</el-menu-item>
            <el-menu-item index="2">Dashboard</el-menu-item>
            <el-menu-item index="3">DevLogs</el-menu-item>
            <el-menu-item index="4">Alarms</el-menu-item>
            <el-submenu index="5" style="float: right;">
                <template slot="title"><i class="el-icon-menu"></i></template>
                <el-menu-item index="5-1"><i class="el-icon-setting"></i> Settings</el-menu-item>
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
    </div>
    <div id="right-panel" ref="right_panel">
    </div>
</div>
</template>

<script>
import api from '../api/request_api.js'
import { setTimeout } from 'timers';
import TopologyComponent from './viewer/TopologyComponent.vue'
import DashboardComponent from './viewer/DashboardComponent.vue'
import AlarmComponent from './viewer/AlarmComponent.vue'
import LogComponent from './viewer/LogComponent.vue'
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
        "alarm-component" : AlarmComponent
    },
    methods: {
        handleSelect(key, keyPath) {
            var me = this;
            if(key === "5-3") {
                me.$confirm("로그아웃 하시겠습니까?", "로그아웃", {
                    confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'info'
                }).then(() => {
                    this.$router.push('/') 
                });
            } else {
                this.activeIndex = key;
            }
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
        me.$loading({});
        $(me.$refs.right_panel).toggle('slide');
        common.events.on("test", function(d) {
            me.$message({
                message:d,
                type:'info'
            })  
        })

        common.events.on('showRightPanel', function(d) {
            $(me.$refs.right_panel).toggle('slide');
        })
        setTimeout(function() {
            me.$loading({}).close();
            me.$message({
                message:'test',
                type:'info'
            });
            
            // me.$confirm("확인창", "확인하시겠습니까?", {
            //     confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning'
            // }).then(() => {
            //     me.$notify({
            //         message: 'copied',
            //         type: 'success'
            //     });
            //     me.$alert('This is a message', 'Title', {
            //         confirmButtonText: 'OK',
            //         callback: action => {
            //             me.$message({
            //             type: 'info',
            //             message: `action: ${ action }`
            //             });
            //         }
            //     });
            // });
        },1000)
        console.log('mounted')
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
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
    width:100vw;
    height:calc(100vh - 60px);
}

#right-panel {
    position: absolute;
    top:60px;
    left:calc(100vw-20vw);
    width:20vw;
    height:calc(100vh - 60px);
    border:1px solid black;
}

#left-panel {
    position: absolute;
    top:60px;
    left:-20vw;
    width:20vw;
    height:calc(100vh - 60px);
}
  
</style>