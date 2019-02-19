<template>
    <router-view/>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    created() {
        console.log(this.$event);
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    destroyed() {
        this.$socket.disconnect();
        console.log('destroyed')
    }
}
</script>

<style lang="css">


body {
    font-family: Poppins-Regular, sans-serif;
    overflow: hidden;
    margin: 0px;
}

</style>
