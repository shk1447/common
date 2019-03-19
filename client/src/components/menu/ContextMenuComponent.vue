<template>
<div class="context-menu-wrapper" v-if="activeContextMenu" v-bind:style="{top:top,left:left}">
  <ul class="menu-options">
    <li class="menu-option" v-for="item in menu_items" v-on:click="handleClickMenu(item)">{{item.label}}</li>
  </ul>
</div>
</template>

<script>
import api from '../../api/api.js'
export default {
    props: {
        actionMenu: { type : Function }
    },
    data () {
        return {
            menu_items : [{id:'add',label:'Add'},
                            {id:'save',label:'Save'},
                            {id:'reload',label:'Reload'},
                            {id:'zoom_reset',label:'Reset Zoom'}],
            activeContextMenu:false,
            top:'0px',
            left:'0px',
            params : {}
        }
    },
    components:{
        
    },
    methods: {
        handleClickMenu(item) {
            var me = this;
            switch(item.id) {
                case 'add' :
                    common.events.emit('popup', {
                        name : 'createNodeModal',
                        params : {node_info:me.params.node_info, node_types:me.params.node_types, event:me.params.event}
                    });
                break;
                case 'reload' : 
                    api.getTopology().then(function(data) {
                        common.view.reload(data);
                        common.events.emit('notify', {message:'Reload Success.', type:'success'})
                    }).catch(function(err) {
                        common.events.emit('notify', {message:'Reload Failure.', type:'error'})
                    })
                break;
                case 'save' :
                    // save current topology
                    var nodes = common.view.getNodes().map(function(d) {
                        return {
                            x:d.x,y:d.y,name:d.name,uuid:d.uuid,type:d.type,status:d.status
                        }
                    });
                    var links = common.view.getLinks().map(function(d) {
                        return {
                            sourceUuid : d.source.uuid,
                            targetUuid : d.target.uuid,
                            speed : d.speed
                        }
                    })
                    api.setTopology({activeNodes:nodes, activeLinks:links}).then(function(){
                        common.events.emit('notify', {message:'Save Success.', type:'success'})
                    }).catch(function(err) {
                        common.events.emit('notify', {message:'Save Failure.', type:'error'})
                    })
                    console.log('save');
                break;
                case 'zoom_reset' :
                    common.view.zoom_reset();
                break;
            }
            me.activeContextMenu = false;
        },
        handleContextMenu(d) {
            var me = this;
            me.left = d.left + 'px';
            me.top = d.top + 'px';
            me.params = d.params;
            me.activeContextMenu = d.active;
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
        common.events.on('contextmenu', me.handleContextMenu)
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        var me = this;
        console.log('destroyed')
        common.events.off('contextmenu', me.handleContextMenu);
    }
}
</script>
<style scoped>

.context-menu-wrapper {
    position: absolute;
    z-index: 1000;
}

.menu-options {
    background: #FAFAFA;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 150px;
    z-index: 999999;
}

.menu-options li {
    border-bottom: 1px solid #E0E0E0;
    margin: 0;
    padding: 5px 35px;
}

.menu-options li:last-child {
    border-bottom: none;
}

.menu-options li:hover {
    background: #1E88E5;
    color: #FAFAFA;
}

</style>