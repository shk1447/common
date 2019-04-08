<template>
<div style="height:100%; overflow:auto">
    <el-tree class="demo" ref="tree" draggable :data="data" :props="defaultProps" node-key="id" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onNodeDragStart">
            <!-- draggable :allow-drag="allowDrag" :allow-drop="allowDrop"  -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.type === 'folder' ? 'fas fa-folder-plus' : (data.type === 'date' ? 'fas fa-calendar-alt' : (data.type === 'favorite' ? 'fas fa-star' : 'far fa-star'))"></i>   {{ node.label }}</span>
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
        refresh() {
            console.log('refresh')
            var me = this;
            api.getDaily().then(function(data) {
                me.data[0].children = data;
                me.data[1].children =[{
                    id:sessionStorage.getItem("user"),
                    name: sessionStorage.getItem("user"),
                    type:'favorite'
                }]
            })
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