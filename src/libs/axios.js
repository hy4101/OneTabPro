import Vue from 'vue';
import axios from 'axios';
import { getAuthorization } from './Storage';
import { i18n, toast } from './util';

Vue.prototype.axios = axios;

const Qs = require('qs');
axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

/**
 * 请求拦截
 */
axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = getAuthorization();
  config.headers.common['DeviceId'] = 'onetabpro';
  config.headers.common['port'] = 'onetabpro';
  // config.headers.common['Language'] = chrome.i18n.getUILanguage();
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * 响应拦截
 */
axios.interceptors.response.use(function (response) {
  let r = response.data;
  if (r instanceof Object && !r.success) {
    switch (r.code) {
      case 401:
        toast(r.message, 'error');
        break;
      default:
        break;
    }
    return Promise.reject(response);
  } else {
    return response;
  }
}, function (error) {
  if (error.response.status === 401) {
    toast(i18n('againLogin'), 'error');
  }
  return Promise.reject(error);
});
