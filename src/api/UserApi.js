import axios from 'axios';
import { getServiceHost } from './Api';
import md5 from 'js-md5';
import { getDeviceId } from '../libs/util';

const USER_URL = getServiceHost() + 'visitors/user/';
const qs = require('qs');

/**
 * 发送验证码
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const sendCaptcha = params => {
  return axios.post(USER_URL + 'send-captcha', qs.stringify(params));
};

/**
 * 登录
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const login = params => {
  let lg = Object.assign({}, params);
  lg.password = md5(lg.password);
  return axios.post(USER_URL + 'login', lg);
};

/**
 * 退出
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const logout = params => {
  return axios.delete(USER_URL + 'logout', params);
};

/**
 * 注册或忘记密码
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const registered = params => {
  let lg = Object.assign({}, params);
  lg.password = md5(lg.password);
  return axios.post(USER_URL + 'registered', lg);
};

/**
 * 重置密码
 * @returns {AxiosPromise<any>}
 * @param code
 * @param password
 */
export const resetPassword = (code, password) => {
  password = md5(password);
  return axios.post(USER_URL + 'reset-password', { code: code, password: password });
};

/**
 * 设置用户头像
 * @returns {AxiosPromise<any>}
 * @param image
 */
export const settingUserAvatarApi = (image) => {
  return axios.post(USER_URL + 'user-avatar/image', qs.stringify({ avatar: image }));
};
