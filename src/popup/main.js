import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import VueRouter from 'vue-router'
import router from '../router'
import store from '../store'
/* eslint-disable no-new */

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuex)
Vue.use(VueRouter)

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
