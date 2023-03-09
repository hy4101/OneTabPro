import axios from 'axios';
const API_1 = 'https://api.miniits.com';
export const getServiceHost = (root = '/browser-desktop-server-api/') => {
  let prod = API_1 + root;
  return process.env.NODE_ENV === 'production' ? prod : 'http://127.0.0.1:20000' + root;
};

const Qs = require('qs');
axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

// 请求拦截
axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});
