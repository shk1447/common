<template>
<div style="height:100%; background:#474f59; display:flow-root;">
    <ul class="snb_menu">
        <li :class="selected_id === menu.id ? 'active' : ''" v-for="menu in menu_list" :key="menu.id" @click="handleClickItem(menu)">
            <a>
                <p class="title">
                    <span :class="'ic ' + menu.icon"></span>
                    <span class="txt">{{menu.label}}</span>
                </p>
                <span :class="menu.expand ? 'ic ic_snb_up' : 'ic ic_snb_down'" v-if="menu.children.length > 0"></span>
            </a>
            <transition name="slide-fade">
                <ul class="snb_submenu" v-if="menu.expand">
                    <li :class="selected_id === sub_menu.id ? 'active' : ''" v-for="sub_menu in menu.children" :key="sub_menu.id" @click="handleClickSubItem(sub_menu,$event)">
                        <a><p class="title"><span class="txt">{{sub_menu.label}}</span></p></a>
                    </li>
                </ul>
            </transition>
        </li>
    </ul>
    <div class="copyright">
        <p class="copy_txt">Copyright PRIBIT TECHNOLOGY INC.</p>
        <p class="copy_txt">All rights reserved.</p>
        <div class="copy_btn">
            <a title="Access terms">Access terms</a>
            <a title="Privacy Statement">Privacy Statement</a>
        </div>
    </div>
</div>
</template>

<script>

import api from '../../api/api.js'

export default {
    data () {
        return {
            selected_id :"topology",
            menu_list :[{
                id:"network",
                label:"네트워크",
                icon:"ic_snb_network",
                expand: true,
                children:[{
                    id:"topology",
                    label:"토폴로지"
                }]
            }],
            sample_menu:[{
                id:"network",
                label:"네트워크",
                icon:"ic_snb_network",
                expand: true,
                children:[{
                    id:"topology",
                    label:"토폴로지"
                },{
                    id:"router",
                    label:"인스턴스"
                },{
                    id:"load_balancer",
                    label:"로드밸런서"
                }]
            },{
                id:"vServer",
                label:"가상서버",
                icon:"ic_snb_server",
                expand: true,
                children:[{
                    id:"instance",
                    label:"인스턴스"
                },{
                    id:"dynamic_ip",
                    label:"유동아이피"
                },{
                    id:"image",
                    label:"이미지"
                },{
                    id:"security",
                    label:"시큐리티 그룹"
                },{
                    id:"backup_restore",
                    label:"백업 & 복구"
                }]
            },{
                id:"storage",
                label:"스토리지",
                icon:"ic_snb_storage",
                expand: true,
                children:[{
                    id:"volume",
                    label:"볼륨"
                },{
                    id:"snapshot",
                    label:"스냅샷"
                }]
            },{
                id:"project",
                label:"관리서비스",
                icon:"ic_snb_project",
                expand: true,
                children:[{
                    id:"hyper",
                    label:"하이퍼바이저"
                },{
                    id:"virtual_infra",
                    label:"가상화인프라"
                },{
                    id:"auto_scale",
                    label:"AutoScale"
                }]
            }]
        }
    },
    components:{
        
    },
    methods: {
        handleClickSubItem(item, event) {
            event.preventDefault();
            event.stopPropagation();
            this.selected_id = item.id;
        },
        handleClickItem(item) {
            if(item.children && item.children.length > 0) {
                item.expand = !item.expand;
            } else {
                // action list
                this.selected_id = item.id;
            }
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

.copyright {position:absolute; left:20px; bottom:20px; color:#6e7782; font-size:11px; z-index:100; background:#474f59;}
.copyright p.copy_txt {margin:0 0 6px;}
.copyright .copy_btn {margin-top:20px;}
.copyright .copy_btn a {color:#6e7782;}
.copyright .copy_btn a:first-child {margin-right:8px; padding-right:11px; border-right:1px solid #6e7782;}

.snb_wrap .snb_menu {position:absolute; top:151px; left:0; bottom:115px; margin-right:auto; width:100%; overflow-y:auto; background:#474f59; scrollbar-face-color:#222; scrollbar-3dlight-color:#474f59; scrollbar-highlight-color:#474f59; scrollbar-shadow-color:#222; scrollbar-darkshadow-color:#474f59; scrollbar-arrow-color:#474f59; scrollbar-track-color:#474f59}

.menu_bar {
    font-size: 12px;
}

.snb_menu>li {border-bottom:1px solid #3a424b;cursor: pointer;}
.snb_menu li a {width:100%; position:relative; }
.snb_menu li p.title {padding:15px 46px 15px 24px; width:100%;}
.snb_menu > li > a > p.title .txt {display:inline-block; margin-left:6px; width:80%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; color:#b8c3d1;}
.snb_menu > li > a > p.title:hover {background:#414952;}

.snb_submenu>li {cursor: pointer;}
.snb_submenu li p.title {padding:10px 51px; color:#8c98a8;}
.snb_submenu li p.title.on, .snb_submenu li p.title:hover {color:#21bec6;}

.snb_menu li .ic_snb_up, .snb_menu li .ic_snb_down {position:absolute; bottom:20px; left:216px;}

.title {
    margin:0;
}
a {text-decoration: none}

/* 애니메이션 진입 및 진출은 다른 지속 시간 및  */
/* 타이밍 기능을 사용할 수 있습니다. */
.slide-fade-enter-active {
  transition: all .4s ease;
}
.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.snb_menu > .active {
    background: #414952;
}
.snb_submenu > .active {
    background: #414952;
}
</style>