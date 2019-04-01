<template>
<div :class="collapsed ? 'content-wrapper' : 'content-wrapper show'">
    <div style="display:flex; height:50px;width:100%;border:1px solid #e0e3eb;">
        <div style="flex:1 1 auto; border-right:1px solid #e0e3eb; padding:5px 12px"><input v-model="category" style="background-color: transparent;border: none;height: 100%;    user-select: none;    outline: none;    font-weight: 700;    font-size: 14px;"/></div>
        <div style="flex:0 0 auto; "></div>
        <div style="flex:1 1 100%; "></div>
        <div style="flex:0 0 auto; "></div>
    </div>
    <div id="chart-space">
    </div>
</div>
</template>

<script>

import api from '../../api/api.js'

export default {
    data () {
        return {
            collapsed:true,
            category:'121600'
        }
    },
    components:{
        
    },
    methods: {
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        console.log('mounted');
        common.chart.init('chart-space');
        api.getData('121600').then(function(data) {
            common.chart.load(data);
        })
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
  
#chart-space {
    user-select: none;
    display: flex;
    height: calc(100% - 50px);
}
</style>