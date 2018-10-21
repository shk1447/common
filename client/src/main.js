import Vue from 'vue'

import ElementUI from "element-ui";
import locale from 'element-ui/lib/locale/lang/en'
import './assets/style/style.css';

Vue.use(ElementUI, { locale });
// Vue.$loading = Vue.prototype.$loading;
// Vue.$msgbox = Vue.prototype.$msgbox;
// Vue.$alert = Vue.prototype.$alert;
// Vue.$confirm = Vue.prototype.$confirm;
// Vue.$notify = Vue.prototype.$notify;
// Vue.$message = Vue.prototype.$message;

import App from './App';
import $ from "jquery";
window.$ = $;

import router from './router';
import event_api  from './api/event_api.js';
Vue.prototype.$socket = event_api();

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})