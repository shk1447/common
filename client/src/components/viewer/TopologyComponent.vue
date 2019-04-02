<template>
<div :class="collapsed ? 'content-wrapper' : 'content-wrapper show'">
    <div class="toolbar-wrapper">
        <div class="tool left">
            <el-date-picker class="picker-custom"
            v-model="collection_date"
            type="date"
            @change="onChangeDate"
            placeholder="주가 분석날짜 선택">
            </el-date-picker>
        </div>
        <div class="tool left">
            <span style="font-size:1.2em;">
                <i class="far fa-play-circle"></i>
            </span>
        </div>
        <div style="flex:1 1 100%; "></div>
        <div class="tool right" v-on:click="onFullScreen">
            <span style="font-size:1.2em;">
                <i class="fas fa-expand"></i>
            </span>
        </div>
    </div>
    <div class="handle-wrapper">
        <div :class="open ? 'sub_menu show' : 'sub_menu'" ref="left_panel">
            <sub-menu ref="sub_menu"></sub-menu>
        </div>
        <div class="handle" @click="handlePanelSlide">
            <i :class="open ? 'el-icon-caret-left' : 'el-icon-caret-right'" style="vertical-align: middle;"></i>
        </div>
    </div>
    <div id="view-space">
    </div>
</div>
</template>

<script>
import SubLeftMenuPanel from '../panel/SubLeftMenuPanel.vue';
import api from '../../api/api.js'

export default {
    data () {
        return {
            open:false,
            collapsed:true,
            collection_date:new Date()
        }
    },
    components:{
        "sub-menu" :SubLeftMenuPanel
    },
    methods: {
        onFullScreen() {
            if(document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                document.documentElement.webkitRequestFullScreen();
            }
        },
        handlePanelSlide() {
            var me = this;
            me.open = !me.open;
        },
        onChangeDate() {
            console.log(this.collection_date);
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
        console.log('mounted');
        setTimeout(function() {
            common.view.init('view-space');
            me.$loading({}).close();
        },500)
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
<style>
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


	
.sub_menu {
  float: left;
  width: 0px;
  height: 100%;
  overflow: hidden;
  -webkit-transition: width .4s;
  transition: width .4s;
  background-color: rgb(253,253,253);
  border: 1px solid #d8dce5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.sub_menu.show {
    width:300px;
}

.content-wrapper {
    position: fixed;
    left: 50px;
    width:calc(100% - 50px);
    height:100%;
    overflow: hidden;
    -webkit-transition: left .3s, width .3s;
    transition: left .3s, width .3s;
}

.content-wrapper.show {
    width:calc(100% - 350px);
    left:350px;
}

.handle-wrapper {
    position: absolute;
    height: calc(100% - 50px);
}

.handle {
  float: left;
  width: 15px;
  height: calc(100% - 50px);
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
}

#view-space {
    height: calc(100% - 50px);
    user-select: none;
}

.picker-custom {
    background-color:transparent;
}
.picker-custom>input {
    border:none;
    background-color:transparent;
}

.picker-custom>input:hover {
    border:none;
    background-color:transparent;
}

</style>