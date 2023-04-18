import axios from 'axios';
import { getServiceHost } from './Api';

const USER_APPLICATION_URL = getServiceHost() + 'user-application/';
const qs = require('qs');

/**
 * 手动保存
 * @param params:[{scope:'desktop'},{scope:'tool'}]
 * @returns {AxiosPromise<any>}
 */
export const saveApplications = params => {
  return axios.post(USER_APPLICATION_URL + 'customize-save', params);
};

/**
 * 生成自提图标
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getFontIcon = params => {
  return axios.post(USER_APPLICATION_URL + 'font-icon', qs.stringify(params));
};

/**
 * 导入浏览器书签
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const importBrowserApi = (params) => {
  return axios.post(USER_APPLICATION_URL + 'import-browser-v2', params);
};

/**
 * 获取浏览器书签
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getBrowser2 = (params) => {
  return axios.get(USER_APPLICATION_URL + 'get-browser-bookmarks-v2', params);
};

/**
 * 获取浏览器书签
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getPrivateBrowser2 = () => {
  return axios.get(USER_APPLICATION_URL + 'get-private-bookmarks-v2');
};

export const getSiteLogo = (url) => {
  return axios.get(USER_APPLICATION_URL + 'get-site-in', { params: { url: url } });
};

/**
 * 获取用户的所以网站数据
 * 包含：desktop、tool、bookmark
 * @returns {AxiosPromise<any>}
 */
export const getAppsApi = () => {
  return axios.get(USER_APPLICATION_URL + 'search/scope/all');
};

/**
 * 移除书签或文件夹（逻辑删除）
 * @returns {AxiosPromise<any>}
 * @param id
 * @param type 删除文件夹时 type 为空
 */
export const removeApplication = (id) => {
  return axios.delete(USER_APPLICATION_URL + 'rubbish-v2/' + id);
};

/**
 * 删除书签或文件夹（物理删除）
 * @returns {AxiosPromise<any>}
 * @param id
 * @param type 删除文件夹时 type 为空
 */
export const deleteApplication = (id) => {
  return axios.delete(USER_APPLICATION_URL + 'delete-v2/' + id);
};

/**
 * 获取app列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const searchUserSiteApi = params => {
  return axios.get(USER_APPLICATION_URL + 'search', { params: params });
};
