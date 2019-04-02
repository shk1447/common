<template>
<div :class="collapsed ? 'content-wrapper' : 'content-wrapper show'">
    <div class="toolbar-wrapper">
        <div class="tool left">
            <el-autocomplete class="auto-input-custom" v-model="selected_item.name" value-key="name" :fetch-suggestions="querySearchAsync"
            placeholder="종목코드 및 종목명" @select="handleSelect">
                <i class="el-icon-search el-input__icon" slot="suffix"></i>
                <template slot-scope="{ item }">
                    <div style="display:flex;">
                        <div style="display:flex; flex:1 1 100%;">{{ item.name }}</div>
                        <div style="display:flex; flex:0 0 auto; padding:1em;"><i class="far fa-star"></i></div>
                    </div>
                </template>
            </el-autocomplete>
        </div>
        <!-- <div :class="signal ? 'tool left signal' : 'tool left'" @click="onSignal">
            <span style="font-size:1.2em;">
                SIGNAL
            </span>
        </div> -->
        <div style="flex:1 1 100%; "></div>
        <div class="tool right">
            <span style="font-size:1.2em;">
                <i class="far fa-bell"></i>
            </span>
        </div>
        <div class="tool right">
            <span style="font-size:1.2em;">
                <i class="far fa-star"></i>
            </span>
        </div>
        <div class="tool right">
            <span style="font-size:1.2em;">
                <i class="fas fa-cloud-upload-alt"></i>
                Save
            </span>
        </div>
        <div class="tool right" v-on:click="onFullScreen">
            <span style="font-size:1.2em;">
                <i class="fas fa-expand"></i>
            </span>
        </div>
    </div>
    <div id="chart-space">
    </div>
</div>
</template>

<script>

import api from '../../api/api.js'
import { setTimeout } from 'timers';

export default {
    data () {
        return {
            collapsed:true,
            open:true,
            selected_item:{
                category:"",
                name:""
            },
            signal:true
        }
    },
    components:{
        
    },
    methods: {
        onSignal() {
            this.signal = !this.signal;
        },
        handleSelect(item) {
            this.selected_item = item;
            this.refresh();
        },
        querySearchAsync(queryString, cb) {
            api.getList(queryString).then(function(data) {
                cb(data);
            })
        },
        onFullScreen() {
            if(document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                document.documentElement.webkitRequestFullScreen();
            }
        },
        onSearchCategory(e) {
            api.getList(this.category).then(function(data) {
                console.log(data);
            })
        },
        refresh() {
            var me = this;
            setTimeout(function() {
                common.chart.uninit('chart-space');
                common.chart.init('chart-space', {signal:me.signal});
                api.getData(me.selected_item.category).then(function(data) {
                    common.chart.load(data);
                })
            },400)
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
        common.chart.init('chart-space', {signal:this.signal});
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

.toolbar-wrapper {
    display:flex; height:49px;width:100%;border-bottom:1px solid #e0e3eb;
}

.tool {
    display:flex; flex:0 0 auto; align-items:center; justify-content:center; padding:1.5em; cursor: pointer;
}
.tool:hover {
    background-color:#f0f3fa;   
}

.tool.left {
    border-right:1px solid #e0e3eb;
}

.tool.right {
    border-left:1px solid #e0e3eb;
}

.tool.signal {
    background-color: #cadeef;
}

.auto-input-custom>.el-input>input {
    border:none;
    background-color: transparent;
}

</style>