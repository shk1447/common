<template>
    <div id="workspace">
    </div>
</template>

<script>

import api from '../../api/api.js'

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
        me.$loading({});
        console.log('mounted');
        setTimeout(function() {
            common.view.init('workspace');
            api.getSampleNodeType().then(function(data) {
                common.view.setNodeType(data);
                me.$loading({}).close();
            })
        },450)
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        console.log('destroyed')
        common.view.uninit();
    }
}
</script>
<style scope>
  
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

.node.selected {
    stroke:#ff7f0e;
    stroke-width:2;
}

.port {
    stroke:#999;
    stroke-width: 1px;
    visibility: collapse;
}

.port.visible {
    visibility: visible;
}

.port_hovered {
    stroke:#ff7f0e;
    fill:#ff7f0e;
}

.link_background {
    stroke: #fff;
    opacity: 0;
    stroke-width: 20;
    cursor: crosshair;
    fill:none;
}

.link_line {
    fill:none;
    pointer-events: none;
}

.link_anim {
    fill:none;
    pointer-events: none;
}

.drag_line {
    stroke:#ff7f0e;
    fill:none;
    pointer-events: none;
}
</style>