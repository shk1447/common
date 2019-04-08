<template>
<div :class="collapsed ? 'content-wrapper' : 'content-wrapper show'" ref="content_wrapper">
    <div class="toolbar-wrapper">
        <div class="tool left">
            <el-autocomplete class="auto-input-custom" v-model="selected_item.name" value-key="name" :fetch-suggestions="querySearchAsync"
            placeholder="종목코드 및 종목명" @select="handleSelect">
                <i class="el-icon-search el-input__icon" slot="suffix"></i>
                <template slot-scope="{ item }">
                    <div style="display:flex;">
                        <div style="display:flex; flex:1 1 100%;">{{ item.name }}</div>
                        <div style="display:flex; flex:0 0 auto; padding:1em;"><i :class="item.favorite_type ? 'fas fa-star' : 'far fa-star'"></i></div>
                    </div>
                </template>
            </el-autocomplete>
        </div>
        <div style="flex:1 1 100%; "></div>
        <div class="tool right" @click="onAlarm">
            <span style="font-size:1.2em;">
                <i :class="alarm ? 'far fa-bell' : 'far fa-bell-slash'"></i>
            </span>
        </div>
        <div class="tool right" @click="onFavorite">
            <span style="font-size:1.2em;">
                <i :class="favorite ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
        </div>
        <div class="tool right" @click="onSave">
            <!-- <el-badge is-dot class="item"> -->
                <span style="font-size:1.2em;">
                    <i class="fas fa-cloud-upload-alt"></i>
                    Save
                </span>
            <!-- </el-badge> -->
        </div>
        <div class="tool right" v-on:click="onFullScreen">
            <span style="font-size:1.2em;">
                <i class="fas fa-expand"></i>
            </span>
        </div>
    </div>
    <div id="sidebar" ref="sidebar"></div>
    <div id="sidebar-separator" class="ui-draggable"></div>
    <div id="chart-space" ref="chart_space">
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
            signal:true,
            alarm:false,
            favorite:false
        }
    },
    components:{
        
    },
    methods: {
        onSave() {
            if(this.selected_item.category) {
                var supstances = common.chart.getSupstances();
                var rawdata = {};
                supstances.map(function(v) {
                    rawdata[v.type] = v.value
                })
                rawdata["name"] = this.selected_item.name;
                var param = {
                    category: this.selected_item.category,
                    email:sessionStorage.getItem('user'),
                    rawdata:rawdata,
                    favorite:this.favorite,
                    alarm:this.alarm
                }
                console.log(supstances);
                api.setFavorite(param).then(function(){
                    common.events.emit('message', {type:'success' , message:'저장 성공'})
                }).catch(function(err) {
                    common.events.emit('message', {type:'fail' , message:'저장 실패'})
                })
                //this.alarm = !this.alarm;
            } else {
                common.events.emit('message', {type:'warning' , message:'검색 후 저장할 수 있습니다.'})
            }
        },
        onAlarm() {
            if(this.selected_item.category) {
                this.alarm = !this.alarm;
            } else {
                common.events.emit('message', {type:'warning' , message:'검색 후 설정가능합니다.'})
            }
        },
        onFavorite() {
            if(this.selected_item.category) {
                this.favorite = !this.favorite;
            } else {
                common.events.emit('message', {type:'warning' , message:'검색 후 설정가능합니다.'})
            }
        },
        onSignal() {
            this.signal = !this.signal;
        },
        handleSelect(item) {
            if(item.favorite_type) {
                this.favorite = true;
                this.alarm = item.favorite_type === 'alarm' ? true : false;
            } else {
                this.favorite = false;
                this.alarm = false;
            }
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
        var me = this;
        console.log('mounted');
        var sidebar =  {};
        $('#sidebar-separator').draggable({
            axis:"x",
            start:function(event, ui) {
                sidebar.closing = false;
                sidebar.start = ui.position.left;
                sidebar.width = me.$refs.content_wrapper.clientWidth - ui.position.left - 12;
            },
            drag: function(event, ui) {
                var sidebar_width = me.$refs.content_wrapper.clientWidth - ui.position.left - 12;
                var chart_space_width = ui.position.left - 2;
                
                me.$refs.sidebar.style.width = sidebar_width + 'px';
                me.$refs.chart_space.style.width = chart_space_width + 'px';
                me.$refs.sidebar.style.border = 'none';
            
                if(sidebar_width < 200) {
                    sidebar.closing = true;
                } else {
                    sidebar.closing = false;
                }
                if(sidebar.closing) {
                    me.$refs.sidebar.style.border = '1px dashed rgb(80, 80, 80)';
                }
                
            },
            stop: function(event, ui) {
                if(sidebar.closing) {
                    var origin_width = me.$refs.content_wrapper.clientWidth - 12;
                    me.$refs.chart_space.style.width = origin_width + 'px';
                    me.$refs.sidebar.style.width = '0px';
                    me.$refs.sidebar.style.border = 'none';
                }
                $("#sidebar-separator").css("left","auto");
                $("#sidebar-separator").css("right",($("#sidebar").width())+"px");
                
                if(me.selected_item.category) me.refresh();
            }
        });
        common.chart.init('chart-space', {signal:this.signal});
    },
    beforeUpdate() {

    },
    updated() {
        
    },
    beforeDestroy() {
        common.chart.uninit();
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

#sidebar-separator {
    position: absolute;
    top:50px !important;
    left:auto;
    right:0px;
    bottom:0px;
    width:10px;
    cursor: col-resize;
    z-index: 10;
    background: #f3f3f3;
    border-left:1px solid #e0e3eb;
    border-right:1px solid #e0e3eb;
}

#sidebar {
    position: absolute;
    top:50px !important;
    right:0px;
    bottom:0px;
    width:0px;
    background: #ffffff;
    z-index:11;
    box-sizing: border-box;
}

</style>