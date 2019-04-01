<template>
    <sidebar-menu :menu="menu" :collapsed="true" @collapse="collapse" @itemClick="itemClick" />
</template>

<script>

import api from '../../api/api.js'

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
                    title: 'STOKER'
                },
                {
                    title: 'VIEW',
                    icon: 'fa fa-project-diagram fa-xs'
                },
                {
                    title: 'CHART',
                    icon: 'fa fa-chart-line'
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