import axios from 'axios';
import { getServiceHost } from './Api';

const USER_URL = getServiceHost() + 'dynamic/';

/**
 * 添加动态信息
 *
 * @returns {AxiosPromise<any>}
 * @param dynamic
 */
export const saveDynamicApi = (dynamic) => {
  return axios.post(USER_URL + 'add', dynamic);
};

/**
 * 查找动态列表
 * @param page
 * @returns {AxiosPromise<any>}
 */
export const searchDynamicApi = (page) => {
  return axios.get(USER_URL + 'search/' + page);
};

/**
 * 删除动态列表
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const deleteDynamicApi = (id) => {
  return axios.delete(USER_URL + 'delete/' + id);
};
