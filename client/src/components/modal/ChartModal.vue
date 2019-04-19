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
        <div id="chart-modal-space"></div>
    </div>
    <div class="modal-footer">
        <el-button size="mini" @click="onSetIchimoku()">일목균형표</el-button>
        <el-button size="mini" @click="onSetAlarm()">SET ALARM</el-button>
        <el-button size="mini" @click="onGotoChart()">GO TO CHART</el-button>
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
        onSetAlarm() {
            var supstances = common.chart.getSupstances();
            var rawdata = {};
            supstances.map(function(v) {
                rawdata[v.type] = v.value
            })
            rawdata["name"] = this.param.name;
            var param = {
                category: this.param.id,
                email:sessionStorage.getItem('user'),
                rawdata:rawdata,
                favorite:true,
                alarm:true
            }
            api.setFavorite(param).then(function(){
                common.events.emit('message', {type:'success' , message:'저장 성공'})
            }).catch(function(err) {
                common.events.emit('message', {type:'fail' , message:'저장 실패'})
            })
        },
        show(d) {
            this.param = d;
            this.$modal.show('chart-modal');
        },
        onSetIchimoku() {
            common.chart.setIchimoku();
        },
        onGotoChart() {
            common.events.emit('onHandlePage', {page_name:'chart', params:this.param});
            this.$modal.hide('chart-modal');
        },
        beforeModalClose() {
            this.$modal.hide('chart-modal');
        },
        openedModal() {
            var me = this;
            common.chart.init('chart-modal-space',{signal:true});
            api.getData(this.param.id).then(function(data) {
                common.chart.load(data, me.param.unixtime, me.param.supstance);
            })
        },
        closedModal() {
            common.chart.uninit();
            common.events.emit('view.focus_target', this.param);
            this.param = {};
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
        stroke: black;
        stroke-width: 0.8;
        stroke-dasharray: 2, 2;
    }

    .scope-supstance.support path {
        stroke: green;
        stroke-width: 0.8;
        stroke-dasharray: 2, 2;
    }

    .scope-supstance.regist path {
        stroke: blue;
        stroke-width: 0.8;
        stroke-dasharray: 2, 2;
    }

    .scope-supstance.result path {
        stroke: blue;
        stroke-width: 2;
        stroke-dasharray: 3, 3;
    }

    .scope-supstance.loss path {
        stroke: red;
        stroke-width: 2;
        stroke-dasharray: 3, 3;
    }

    .mouseover .supstance path {
        stroke-width: 1.5;
    }

    .dragging .supstance path {
        stroke: darkblue;
    }

    .axisannotation path {
        fill: black;
    }

    .axisannotation text {
        fill: #fff;
    }

    path.tradearrow {
        stroke: none;
    }
    .tradearrow path.highlight {
        fill: none;
        stroke-width: 2;
    }

    path.tradearrow.buy {
        fill: #FF0000;
    }
    .tradearrow path.highlight.buy {
        stroke: #FF0000;
    }

    path.tradearrow.buy-pending {
        fill-opacity: 0.2;
        stroke: #0000FF;
        stroke-width: 1.5;
    }

    path.tradearrow.sell {
        fill: #9900FF;
    }
/* 
    .tradearrow path.highlight {
        fill: none;
        stroke-width: 2;
    }

    .tradearrow path.highlight.buy,.tradearrow path.highlight.buy-pending {
        stroke: #000000;
    }

    .tradearrow path.highlight.buy-pending {
        fill: #000000;
        fill-opacity: 0.3;
    }

    .tradearrow path.highlight.sell {
        stroke: #000000;
    } */

    .ichimoku path {
        fill: none;
        stroke-width: 0.8;
    }

    .ichimoku path {
        stroke: #000000;
    }

    .ichimoku path.chikouspan {
        stroke: #BF5FFF;
    }

    .ichimoku path.tenkansen {
        stroke: #0033FF;
    }

    .ichimoku path.kijunsen {
        stroke: #FBB117;
    }

    .ichimoku path.kumo {
        opacity: 0.1;
    }

    .ichimoku path.kumo.up {
        fill: #00AA00;
    }

    .ichimoku path.kumo.down {
        fill: #FF0000;
    }

    .ichimoku path.senkouspana {
        stroke: #006600;
    }

    .ichimoku path.senkouspanb {
        stroke: #FF0000;
    }

#chart-modal-space {
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