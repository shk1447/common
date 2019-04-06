<template>
<div style="height:100%; overflow:auto">
    <el-tree class="demo" ref="tree" draggable :data="data" :props="defaultProps" node-key="id" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onNodeDragStart">
            <!-- draggable :allow-drag="allowDrag" :allow-drop="allowDrop"  -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.type === 'folder' ? 'fas fa-folder-plus' : (data.type === 'date' ? 'fas fa-calendar-alt' : (data.type === 'favorite' ? 'fas fa-star' : 'far fa-star'))"></i>   {{ node.label }}</span>
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
            },{
                id:'favorite',
                name: '유저별 관심 종목',
                type:'folder',
                children: []
            }],
            defaultProps: {
                children: 'children',
                label: 'name',
                disabled:function(data, node) {
                    return data.type === 'folder';
                }
            },
            selected_controllers :[]
        }
    },
    components:{
        
    },
    methods: {
        onNodeDragStart(node,e) {
            var transfer_data = {
                id:node.data.id,
                name:node.data.name,
                prev_id:node.data.prev_id,
                type:node.data.type
            }
            e.dataTransfer.setData("node", JSON.stringify(transfer_data));
        },
        allowDrop(dragNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {

            return true;
        },
        check(node,nodes) {
            var me = this;
            me.$loading({});
            common.view.clear();
            var checked_list = nodes.checkedNodes.filter(function(d) { return d.type === 'date' });
            var params = checked_list.map(function(d) { return {id : d.id, name:d.name,prev_id: d.prev_id}})
            
            if(params.length > 0) {
                if(params.length < 4) {
                    api.getRecommends(params).then(function(map) {
                        common.view.setRecommends(params, map);
                        me.$loading({}).close();
                    })
                } else {
                    this.$refs.tree.setCheckedKeys([]);
                    common.events.emit('message', {type:'warning' , message:'Too many checked!'})
                    me.$loading({}).close();
                }
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
            me.data[1].children.push({
                id:sessionStorage.getItem("user"),
                name: sessionStorage.getItem("user"),
                type:'favorite'
            })
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