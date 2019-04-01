<template>
<div id="workspace" :class="collapsed ? 'content-wrapper' : 'content-wrapper show'">
</div>
</template>

<script>

import api from '../../api/api.js'

export default {
    data () {
        return {
            collapsed:true
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
        common.chart.init('workspace');
        api.getData('140070').then(function(data) {
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
  
#workspace {
    user-select: none;
    height:100%;
}
</style>