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
        <h5>{{param.name}}</h5>
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

import api from '../../api/api.js'

export default {
    data () {
        return {
            param : {}
        }
    },
    components:{
    },
    methods: {
        show(d) {
            this.param = d;
            this.$modal.show('chart-modal');
        },
        beforeModalClose() {
            this.$modal.hide('chart-modal');
        },
        openedModal() {
            common.chart.init('chart-space');
            api.getData(this.param.id).then(function(data) {
                common.chart.load(data);
            })
        },
        closedModal() {
            this.param = {};
            common.chart.uninit();
            common.events.emit('view.zoom_reset', {});
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
        font: 11px sans-serif;
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
        fill: #DDDDDD;
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


    .supstance path {
        stroke: blue;
        stroke-width: 0.8;
        stroke-dasharray: 2, 2;
    }

    .mouseover .supstance path {
        stroke-width: 1.5;
    }

    .dragging .supstance path {
        stroke: darkblue;
    }

    .axisannotation path {
        fill: darkblue;
    }

    .axisannotation text {
        fill: #fff;
    }

    path.tradearrow {
        stroke: none;
    }

    path.tradearrow.buy {
        fill: #0000FF;
    }

    path.tradearrow.buy-pending {
        fill-opacity: 0.2;
        stroke: #0000FF;
        stroke-width: 1.5;
    }

    path.tradearrow.sell {
        fill: #9900FF;
    }

    .tradearrow path.highlight {
        fill: none;
        stroke-width: 2;
    }

    .tradearrow path.highlight.buy,.tradearrow path.highlight.buy-pending {
        stroke: #0000FF;
    }

    .tradearrow path.highlight.buy-pending {
        fill: #0000FF;
        fill-opacity: 0.3;
    }

    .tradearrow path.highlight.sell {
        stroke: #9900FF;
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