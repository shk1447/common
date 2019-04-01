<template>
    <sidebar-menu :menu="menu" />
</template>

<script>

import api from '../../api/api.js'

export default {
    data () {
        return {
            menu: [
                {
                    header: true,
                    title: 'STOKER NAVIGATION',
                    // component: componentName
                    // visibleOnCollapse: true
                },
                {
                    href: '/',
                    title: 'View',
                    icon: 'fa fa-user',
                    /*
                    disabled: true
                    badge: {
                        text: 'new',
                        // class:''
                    }
                    */
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
<style scoped>

</style>