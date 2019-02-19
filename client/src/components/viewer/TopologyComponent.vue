<template>
    <div id="workspace">
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
        var me = this;
        console.log('mounted');
        common.view.init('workspace');
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

.lasso {
    stroke-width: 1px;
    stroke: #3cace7;
    fill: rgba(20, 125, 255, 0.1);
    stroke-dasharray: 10 5;
}

.lasso_hovered {
    stroke: gray;
    fill: rgba(20, 125, 255, 0.2);
    stroke-dasharray: 0 0;
}

.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.1;
  shape-rendering: crispEdges;
}

.active {
  stroke: #000;
  stroke-width: 2px;
}

.node {
    stroke:#999;
    cursor:move;
}

.port {
    stroke:#999;
    stroke-width: 1px;
}

.port_hovered {
    stroke:#ff7f0e;
    fill:#ff7f0e;
}

.link_line {
    stroke:#888;
    stroke-width:5;
    fill:none;
    pointer-events: none;
}

.link_anim {
    stroke:rgb(221, 221, 221);
    stroke-width:5;
    fill:none;
    pointer-events: none;
}

.drag_line {
    stroke:#ff7f0e;
    stroke-width:5;
    fill:none;
    pointer-events: none;
}
</style>