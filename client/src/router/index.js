import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import MainComponent from '../components/MainComponent.vue';
import LoginComponent from '../components/login/LoginComponent.vue';
export default new Router({
      routes: [{
            path: '/',
            name: 'login',
            component: LoginComponent
      },{
            path: '/viewer',
            name: 'viewer',
            component: MainComponent
      }]
})