import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import MainComponent from '../components/MainComponent.vue';
import LoginComponent from '../components/login/LoginComponent.vue';
export default new Router({
      routes: [{
            path: '/',
            name: 'manager',
            component: MainComponent
      },{
            path: '/login',
            name: 'login',
            component: LoginComponent
      }]
})