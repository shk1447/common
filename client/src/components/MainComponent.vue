<template>
<div id="app-main">
    <div id="menu-bar">
        <el-menu :default-active="activeIndex" mode="horizontal">
            <el-menu-item index="1">Topology</el-menu-item>
            <el-menu-item index="2">Dashboard</el-menu-item>
        </el-menu>
    </div>
    <div id="main-container">
        <viewer-component></viewer-component>
    </div>
    <div id="left-panel">
    </div>
    <div id="right-panel">
    </div>
</div>
</template>

<script>
import api from '../api/request_api.js'
import { setTimeout } from 'timers';
import ViewerComponent from './viewer/ViewerComponent.vue'
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
        "viewer-component" : ViewerComponent
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
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
    left:100vw;
    width:20vw;
    height:calc(100vh - 60px);
}

#left-panel {
    position: absolute;
    top:60px;
    left:-20vw;
    width:20vw;
    height:calc(100vh - 60px);
}
  
</style>