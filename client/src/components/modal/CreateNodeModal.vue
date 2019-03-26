<template>
<modal
    class="w-modal"
    ref="create_node_modal"
    id="create-node"
    name="create-node"
    :width="260"
    :height="260"
    :isAutoHeight="false"
    :reset="false"
    :clickToClose="true"
    :resizable="false"
    draggable=".modal-header">
    <div class="modal-header">
        <h5>Create Node</h5>
        <a class="close-modal-btn" role="button" @click="beforeModalClose()"><i class="el-icon-error"></i></a>
    </div>
    <div class="modal-body">
        <el-form ref="create_node_form" size="mini" label-position="left" :model="form" label-width="60px" :rules="rules">
            <el-form-item label="UUID" prop="uuid">
                <el-input v-model="form.uuid"></el-input>
            </el-form-item>
            <el-form-item label="NAME" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="TYPE" prop="type">
                <el-select v-model="form.type" placeholder="please select your zone">
                    <el-option v-for="item in node_types" :key="item.name"
                           :label="item.desc" :value="item.name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
    <div class="modal-footer">
        <el-button size="mini" @click="onSubmit()">OK</el-button>
        <el-button size="mini" @click="beforeModalClose()">CANCEL</el-button>
    </div>
</modal>
</template>

<script>

export default {
    data () {
        return {
            node_types:[],
            form: {
                uuid: '',
                name: '',
                type: ''
            },
            rules: {
                uuid:[{required:true,message:'Please input uuid', trigger:'blur'}],
                name:[{required:true,message:'Please input name', trigger:'blur'}],
                type:[{required:true,message:'Please select type', trigger:'blur'}]
            },
            node_info:{}
        }
    },
    components:{
        
    },
    methods: {
        show(opt) {
            this.$refs.create_node_modal.pivotX = Math.abs(opt.event.x)/opt.event.view.innerWidth;
            this.$refs.create_node_modal.pivotY = Math.abs(opt.event.y)/opt.event.view.innerHeight;
            this.node_info = opt.node_info;
            this.node_types = opt.node_types;
            this.$modal.show('create-node');
        },
        beforeModalClose() {
            this.node_info = {};
            this.node_types = [];
            this.form = {
                uuid: '',
                name: '',
                type: ''
            }
            this.$modal.hide('create-node');
        },
        onSubmit() {
            var me = this;
            var node_info = this.form;
            node_info["x"] = this.node_info.x;
            node_info["y"] = this.node_info.y;
            node_info["status"] = this.node_info.status;
            this.$refs.create_node_form.validate(function(valid) {
                if(valid) {
                    common.events.emit('onAddNode', node_info);
                    me.beforeModalClose();
                } else {
                    me.$message({
                        message:'validation error',
                        type:'warning'
                    });
                    return false;
                }
            })
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

.w-modal .modal-body {
    height: calc(100% - 110px);
    padding: 12px;
    overflow: auto;
}

.w-modal .modal-footer {
    display: block;   
    text-align: center;
    padding: 0.5rem;
}

.close-modal-btn {
    width: 20px;
    height: 20px;
    border-radius: 11px;
    color: #3f6393;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.close-modal-btn:hover {
    color: #529eff;
}
</style>