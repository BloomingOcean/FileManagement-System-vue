// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import global from './Global'
import VueResource from 'vue-resource'

// //引入axios，并加到原型链中
import axios from 'axios';
// //用来解决vue中post请求（详情）
Vue.prototype.$axios=axios;
// import QS from 'qs'; 
// Vue.prototype.qs = QS;

Vue.config.productionTip = false
Vue.prototype.global = global;

Vue.use(ElementUI);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
