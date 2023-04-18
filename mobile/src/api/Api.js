import axios from 'axios';
import router from "../route";
import { getDeviceId, isEmpty } from '@/libs/util';
import { Notice } from 'view-design';

// const API_1 = 'http://options.miniits.com';
export const getServiceHost = (root = '/browser-desktop-server-api/') => {
  // let prod = API_1 + root;
  return process.env.NODE_ENV === 'production' ? root : root;
};

const Qs = require('qs');
axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

/**
 * 请求拦截
 */
axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = localStorage.getItem('Authorization');
  config.headers.common['DeviceId'] = getDeviceId();
  config.headers.common['port'] = 'miniits';
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * 响应拦截
 */
axios.interceptors.response.use((response) => {
  let r = response.data;

  if (r instanceof Object && !r.success) {
    switch (r.code) {
      case 401:
        Notice.info({
          desc: r.message,
          type: 'error'
        });
        break;
      case 405:
        break;
      default:
        Notice.info({ desc: r.message, type: 'error' });
        break;
    }
    return Promise.reject(response);
  } else {
    return response;
  }
}, function (error) {
  if (error.status === 400) {
    let message = isEmpty(error.data) ? '系统异常，请联系管理员！' : error.data;
    Notice.info({
      desc: message,
      type: 'error'
    });
    return Promise.reject(error);
  } else if (error.status === 401) {
    router.push('/login');
  } else if (error.status === 403) {
    router.push({ name: 'login' });
  } else {
    /* 请求错误时做些事 */
    Notice.info({
      desc: '系统出错，请联系管理员',
      type: 'error'
    });
    return Promise.reject(error);
  }
});

