import Vue from 'vue';
import App from './App';
import 'view-design/dist/styles/iview.css';
import axios from 'axios';
import router from './route/index.js';
import ViewUI from 'view-design';

Vue.use(ViewUI);

/**
 * 注册指令
 */
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

const Qs = require('qs');
axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

