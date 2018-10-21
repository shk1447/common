<template>
  <div id="app-main">
    <router-view/>
  </div>
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
    overflow: hidden;
}
</style>
