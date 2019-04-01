import Vue from 'vue'

// ui framework
import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
import './assets/style/style.css';

// Menu
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)

// Modal
import vmodal from 'vue-js-modal';
Vue.use(vmodal);
Vue.use(ElementUI, { locale });
// Vue.$loading = Vue.prototype.$loading;
// Vue.$msgbox = Vue.prototype.$msgbox;
// Vue.$alert = Vue.prototype.$alert;
// Vue.$confirm = Vue.prototype.$confirm;
// Vue.$notify = Vue.prototype.$notify;
// Vue.$message = Vue.prototype.$message;

import App from './App';

import 'expose-loader?$!expose-loader?jQuery!jquery';
// import $ from "jquery";
// window.$ = $;

import router from './router';
//import event_api  from './api/event_api.js';
//Vue.prototype.$socket = event_api();

import './core';


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})