<template>
<div style="height:100%">
<el-tabs class="left_tabs" type="border-card">
    <el-tab-pane>
        <span slot="label" class="tab_title"><i class="el-icon-share"></i> Controller</span>
        <el-tree class="demo" show-checkbox draggable default-expand-all ref="controller_list"
             :data="data" :props="defaultProps" node-key="uuid"
             :allow-drag="allowDrag" :allow-drop="allowDrop" @check="check">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.type === 'folder' ? 'el-icon-goods' : 'el-icon-share'"></i>   {{ node.label }}</span>
            </span>
        </el-tree>
    </el-tab-pane>
    <el-tab-pane>
        <span slot="label" class="tab_title"><i class="el-icon-date"></i> Test</span>
    </el-tab-pane>
</el-tabs>
<!-- <div style="margin-top:5px;">
<el-button-group>
  <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
  <el-button size="mini" type="primary" icon="el-icon-share"></el-button>
  <el-button size="mini" type="primary" icon="el-icon-delete"></el-button>
</el-button-group>
</div> -->
</div>
</template>

<script>

import api from '../../api/api.js'

export default {
    data () {
        return {
            data: [{
                uuid:'fluid',
                name: 'fluid',
                type:'folder',
                children: []
            },{
                uuid:'custom',
                name: 'custom',
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
            common.view.clear();
            var controllers = nodes.checkedNodes.filter(function(d) { return d.type !== 'folder'});
            if(controllers.length > 0) {
                me.$loading({});
                api.getSampleMap(controllers).then(function(data) {
                    common.view.reload(data);
                    me.$loading({}).close();
                })
            }
            me.selected_controllers = controllers;
        },
        allowDrag(node) {
            var allow = true;
            if(node.data.uuid === 'fluid' || node.data.uuid === 'custom') {
                allow = false;
            }
            return allow;
        },
        allowDrop(drag_node, drop_node, type) {
            var allow = true;
            console.log(drag_node.data.uuid, drop_node.data.uuid , type);
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
        api.getSampleController().then(function(data) {
            var fluid_folder = me.data.find(function(d) { return d.uuid === 'fluid' });
            fluid_folder.children = data;
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
</style>