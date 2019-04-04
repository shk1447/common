<template>
    <sidebar-menu :menu="menu" :collapsed="true" @collapse="collapse" @itemClick="itemClick" />
</template>

<script>

import api from '../../api/api.js'

const separator = {
  template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`
}

export default {
    props: {
        collapse: { type : Function },
        itemClick: { type : Function }
    },
    data () {
        return {
            menu: [
                {
                    header: true,
                    title: 'STOCK'
                },
                {
                    title: 'VIEW',
                    type:'content',
                    icon: 'fa fa-code-branch'
                },
                {
                    title: 'CHART',
                    type:'content',
                    icon: 'fa fa-chart-line'
                },
                {
                    header: true,
                    component: separator,
                    visibleOnCollapse: true
                },
                {
                    header: true,
                    title: 'USER'
                },
                {
                    title: 'Accounts',
                    type:'content',
                    icon: 'fas fa-users',
                    badge: {
                        text: 'new',
                        class: 'badge-danger'
                    }
                },
                {
                    title: 'Logout',
                    type:'action',
                    icon: 'fas fa-sign-out-alt',
                    action: function() {
                        var me = this;
                        api.logout().then(function() {
                            location.href = '/';
                        })
                    }
                }
            ]
        }
    },
    components:{
        
    },
    methods: {
        
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        
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
    .v-sidebar-menu .vsm-icon {
        background-color: transparent !important;
    }
    .vsm-list {
        width: 100% !important;
        padding-right:0px !important;
    }
    .v-sidebar-menu .vsm-link {
        font-size: 12px !important;
    }
</style>