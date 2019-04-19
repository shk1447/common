<template>
<modal
    class="w-modal"
    ref="chart_modal"
    id="chart-modal"
    name="chart-modal"
    :width="1000"
    :height="600"
    :isAutoHeight="false"
    :reset="false"
    :clickToClose="true"
    :resizable="false"
    @opened="openedModal"
    @closed="closedModal"
    draggable=".modal-header">
    <div class="modal-header">
        <h5>Traffic Chart</h5>
        <a class="close-modal-btn" role="button" @click="beforeModalClose()"><i class="el-icon-error"></i></a>
    </div>
    <div class="modal-body">
        <div id="chart-space"></div>
    </div>
    <div class="modal-footer">
        <el-button size="mini" @click="beforeModalClose()">CONFIRM</el-button>
    </div>
</modal>
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
        show(d) {
            this.$modal.show('chart-modal');
        },
        beforeModalClose() {
            this.$modal.hide('chart-modal');
        },
        openedModal() {
            common.chart.init('chart-space');
        },
        closedModal() {
            common.chart.uninit();
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
.upGreenArrow{
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 0 4.5px 12px 4.5px;
   border-color: transparent transparent #00ff00 transparent;
}
  
.downRedArrow{
   width: 0;
   height: 0;
   border-style: solid;
   border-width: 12px 4.5px 0 4.5px;
   border-color: #ff0000 transparent transparent transparent;
}

.upArrow{
  position: relative;
  top: -15px;
  left: -10px;
  width:0;
  height:0;
  border: 6px solid transparent;
  border-bottom-color: #00ff00;
}
.upArrow:after{
  position: absolute;
  content: '';
  top: 20px;
  left: -3px;
  width: 6px;
  height: 10px;
  background: #00ff00;
}

.downArrow{
  position: relative;
  top: 18px;
  left: -10px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-top-color: #ff0000;
}
.downArrow:after{
  position: absolute;
  content: '';
  top: -15px;
  left: -3px;
  width: 6px;
  height: 10px;
  background: #ff0000;
}


/* d3 candle stick start */

.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.axis text {
    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    fill: black;
}

#chart-space {
    width:100%;
    height:100%;
}

.area {
  fill: steelblue;
  clip-path: url(#clip);
}

.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}
</style>