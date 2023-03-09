import Vue from 'vue';
import AppComponent from './App/App.vue';
import axios from '../libs/axios.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './route/index.js';

Vue.component('app-component', AppComponent);

Vue.use(ElementUI);
Vue.prototype.axios = axios;
new Vue({ // eslint-disable-line
  el: '#options',
  router,
  render: createElement => {
    return createElement(AppComponent);
  }
});
