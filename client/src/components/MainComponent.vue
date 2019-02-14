<template>

<div id="main-container">
  <viewer-component></viewer-component>
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
            data_list:{}
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
  
</style>