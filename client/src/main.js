import Vue from 'vue'

import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
import './assets/style/style.css';
import vmodal from 'vue-js-modal';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faDoorOpen, faWonSign, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret)
library.add(faDoorOpen)
library.add(faWonSign);
library.add(faAngleDown);
library.add(faAngleUp)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)



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