<template>

<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
  <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">Navigator One</span>
    </template>
    <el-menu-item-group>
      <span slot="title">Group One</span>
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4">
      <span slot="title">item four</span>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-submenu>
  </el-submenu>

</el-menu>


</template>

<script>
import api from '../api/request_api.js'
import { setTimeout } from 'timers';
export default {
    data () {
        return {
            isCollapse: true,
            code_list:[],
            data_list:{}
        }
    },
    components:{
        
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
        api.get(location.origin + '/stock/code').then(function(code_list) {
            console.log(code_list);
            me.code_list = code_list;
            me.$loading({}).close();
            // function get_data(i) {
            //     var code = me.code_list[i];
            //     api.get(location.origin + '/stock/data?code=' + code).then(function(stock_data) {
            //         me.data_list[code] = stock_data;
            //         i++;
            //         if(i < code_list.length) get_data(i);
            //         else me.$loading({}).close();
            //     })
            // }
            // get_data(0);
        }) 
        // setTimeout(function() {
        //     me.$loading({}).close();
        //     me.$message({
        //         message:'test',
        //         type:'info'
        //     });
            
        //     me.$confirm("확인창", "확인하시겠습니까?", {
        //         confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning'
        //     }).then(() => {
        //         me.$notify({
        //             message: 'copied',
        //             type: 'success'
        //         });
        //         me.$alert('This is a message', 'Title', {
        //             confirmButtonText: 'OK',
        //             callback: action => {
        //                 me.$message({
        //                 type: 'info',
        //                 message: `action: ${ action }`
        //                 });
        //             }
        //         });
        //     });
        // },1000)
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
  .el-menu-vertical-demo {
    width: 200px;
    min-height: 100vh;
  }
</style>