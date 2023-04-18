import axios from 'axios';
import { getServiceHost } from './Api';
import md5 from "js-md5";

const USER_URL = getServiceHost() + 'visitors/user/';
const qs = require('qs');

/**
 * 获取用户信息
 * @returns {AxiosPromise<any>}
 */
export const getUserInfo = () => {
  return axios.get(USER_URL + 'user-info');
};

/**
 * 设置pin密码
 * @returns {AxiosPromise<any>}
 * @param pin
 * @param password
 */
export const settingPin = (pin, password) => {
  password = md5(password);
  pin = md5(pin);
  return axios.post(USER_URL + 'setting-pin', { pin: pin, password: password });
};

/**
 * 设置用户头像
 * @returns {AxiosPromise<any>}
 * @param image
 */
export const settingUserAvatarApi = (image) => {
  return axios.post(USER_URL + 'user-avatar/image', qs.stringify({ avatar: image }));
};

/**
 * 获取用户列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const searchUserApi = params => {
  return axios.get(USER_URL + 'search', { params: params });
};


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
