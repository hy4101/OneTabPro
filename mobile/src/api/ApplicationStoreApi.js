import axios from 'axios';
import { getServiceHost } from './Api';

const USER_URL = getServiceHost() + 'application-store/';
const qs = require('qs');
/**
 * 添加网站到
 * type = desktop :到桌面
 * type = tool :到工具栏
 *
 * @param id
 * @param type
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const addSiteToApi = (id, type, params) => {
  return axios.post(USER_URL + 'add-site-to/' + id + '/' + type, qs.stringify(params));
};

/**
 * 获取app列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const searchApplicationStoresApi = params => {
  return axios.get(USER_URL + 'search', { params: params });
};
