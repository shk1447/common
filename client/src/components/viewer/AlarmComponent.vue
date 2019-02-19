<template>
<div id="workspace" style="
    text-align: center;
    display: table;
">
    <div style="
    display: table-cell;
    vertical-align: middle;
">Comming Soon!</div>
</div>
</template>

<script>

export default {
    data () {
        return {
            
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
    width:100%;
    height:100%;
}
</style>