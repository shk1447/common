<template>
<modal
    class="w-modal"
    id="create-node"
    name="create-node"
    :clickToClose="true"
    :resizable="false"
    draggable=".modal-header">
    <div class="modal-header"><h5>Create Node</h5></div>
    <div class="modal-body">
    <el-tabs v-model="activeName">
        <el-tab-pane label="User" name="first">User</el-tab-pane>
        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
    </el-tabs>
    </div>
    <div class="modal-footer">
        <el-button-group>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="primary" icon="el-icon-share"></el-button>
            <el-button type="primary" icon="el-icon-delete"></el-button>
        </el-button-group>
    </div>
</modal>
</template>

<script>

export default {
    data () {
        return {
            activeName:"first"
        }
    },
    components:{
        
    },
    methods: {
        show() {
            this.$modal.show('create-node');
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
<style>
.w-modal .modal-header h5 {margin: 0; font-size: 12px;}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: .3rem;
  border-top-right-radius: .3rem;
}

.w-modal .modal-body { padding: 12px;}

.w-modal .modal-footer {
    display: flex;
    position: absolute;
}
</style>