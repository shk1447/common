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
html, body {
  width: 100%;
  height: 100%;
  background: #fdfdfd;
}

body {
    font-family: Poppins-Regular, sans-serif;
    overflow: hidden;
    margin: 0px;
    font-size:12px;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
    width:15px;
    _background-color:#f0f0f0;
}
 
::-webkit-scrollbar-corner {
}
 
::-webkit-scrollbar-thumb {
    border-radius: 15px;
    border:4px solid rgba(255,255,255,0);
    background-clip:content-box;
    background-color: #e8eef1; 
}

</style>
