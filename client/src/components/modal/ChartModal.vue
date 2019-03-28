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
        <h5>Chart</h5>
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


    body {
        font: 10px sans-serif;
    }

    text {
        fill: #000;
    }

    path.candle {
        stroke: #000000;
    }

    path.candle.body {
        stroke-width: 0;
    }

    path.candle.up {
        fill: #FF0000;
        stroke: #FF0000;
    }

    path.candle.down {
        fill: #0000FF;
        stroke: #0000FF;
    }

    path.ohlc {
        stroke: #000000;
        stroke-width: 1;
    }

    path.ohlc.up {
        stroke: #00AA00;
    }

    path.ohlc.down {
        stroke: #FF0000;
    }

    path.volume {
        fill: #EEEEEE;
    }

    path.line {
        fill: none;
        stroke: #BF5FFF;
        stroke-width: 1;
    }

    .extent {
        stroke: #fff;
        fill-opacity: .125;
        shape-rendering: crispEdges;
    }

    .crosshair {
        cursor: crosshair;
    }

    .crosshair path.wire {
        stroke: #DDDDDD;
        stroke-dasharray: 1, 1;
    }

    .crosshair .axisannotation path {
        fill: #DDDDDD;
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