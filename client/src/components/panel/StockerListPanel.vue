<template>
<div style="height:100%">
<el-tabs class="left_tabs" type="border-card">
    <el-tab-pane>
        <span slot="label" class="tab_title"><i class="el-icon-share"></i> Recommend</span>
        <el-tree class="demo" show-checkbox draggable default-expand-all ref="controller_list"
             :data="data" :props="defaultProps" node-key="id"
             :allow-drag="allowDrag" :allow-drop="allowDrop" @check="check">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.id === 'goods' ? 'el-icon-goods' : 'el-icon-star-off'"></i>   {{ node.label }}</span>
                <span v-if="data.id !== 'goods'">
                    <i class="el-icon-circle-plus-outline action" @click="append(data,$event)"></i>
                    <i v-if="data.id !== 'favorite'" class="el-icon-delete action" @click="remove(node,data,$event)"></i>
                </span>
            </span>
        </el-tree>
    </el-tab-pane>
</el-tabs>
</div>
</template>

<script>
let id = 1000;
import api from '../../api/api.js'

export default {
    data () {
        return {
            data: [{
                id:'goods',
                name: 'Goods',
                type:'folder',
                children: []
            },{
                id:'favorite',
                name: 'Favorite',
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
        test(a,b) {
            console.log(a,b)
        },
        append(data,event) {
            event.preventDefault();
            event.stopPropagation();
            const newChild = { id: id++, name: 'testtest', children: [] };
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data,event) {
            event.preventDefault();
            event.stopPropagation();
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
        check(node,nodes) {
            var me = this;
        },
        allowDrag(node) {
            var allow = true;
            if(node.data.id === 'goods' || node.data.id === 'favorite') {
                allow = false;
            }
            return allow;
        },
        allowDrop(drag_node, drop_node, type) {
            var allow = true;
            if(drag_node.data.type !== 'folder' && drop_node.data.type !== 'folder' && type === 'inner') {
                allow = false;
            } else if(drop_node.data.type === 'folder' && (type === 'prev' || type === 'next')) {
                allow = false;
            }
            return allow;
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
        api.getGoods().then(function(data) {
            me.data[0].children = data;
        });
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
</style>