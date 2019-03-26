<template>
<div style="height:100%; overflow:auto">
    <el-tree class="demo" show-checkbox :data="data" :props="defaultProps" node-key="id" @check="check">
            <!-- draggable :allow-drag="allowDrag" :allow-drop="allowDrop"  -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.id === 'daily' ? 'el-icon-date' : 'el-icon-star-off'"></i>   {{ node.label }}</span>
            <!-- <span v-if="data.id !== 'fluid'">
                <i class="el-icon-circle-plus-outline action" @click="append(data,$event)"></i>
                <i v-if="data.id !== 'fluid'" class="el-icon-delete action" @click="remove(node,data,$event)"></i>
            </span> -->
        </span>
    </el-tree>
</div>
</template>

<script>
let id = 1000;
import api from '../../api/api.js'

export default {
    data () {
        return {
            data: [{
                id:'daily',
                name: '일별 추천 리스트',
                type:'folder',
                children: []
            }],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            selected_controllers :[]
        }
    },
    components:{
        
    },
    methods: {
        check(node,nodes) {
            var me = this;
            me.$loading({});
            common.view.clear();
            var checked_list = nodes.checkedNodes.filter(function(d) { return d.type !== 'folder' });
            var params = checked_list.map(function(d) { return {id : d.id, name:d.name,prev_id: d.prev_id}})
            console.log(params);
            if(params.length > 0) {
                
                api.getRecommends(params).then(function(map) {
                    common.view.setRecommends(params, map);
                    me.$loading({}).close();
                })
                
                // api.getUnderlay(params).then(function(underlay) {
                //     api.getOverlay(params).then(function(overlay) {
                //         console.log(underlay, overlay);
                //         common.view.setMap(params,underlay, overlay);
                //         me.$loading({}).close();
                //     })
                // })
                
            } else {
                me.$loading({}).close();
            }
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
        api.getDaily().then(function(data) {
            me.data[0].children = data;
        })
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
<style scoped>
.demo {
    background : transparent;
}

.left_tabs { 
    height: 100%;
}

.tab_title {
    font-size : 12px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.action {
    margin-left: 4px;
}
.action:hover {
    color: rgb(99,170,244);
}

.wow {
    height: calc(100% - 39px);
    overflow: auto;
}
</style>