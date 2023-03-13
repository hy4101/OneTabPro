import axios from 'axios';
import { getServiceHost } from './Api';

export const USER_URL = getServiceHost() + 'tab/';
const qs = require('qs');
/**
 * 保存标签
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const saveTabsApi = (params) => {
  return axios.post(USER_URL + 'archive-tab', params);
};

/**
 * 查看历史记录
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getTabsApi = () => {
  return axios.get(USER_URL + 'get-tab');
};

/**
 * 删除标签组
 * @returns {AxiosPromise<any>}
 * @param group
 */
export const deleteTabGroupApi = (group) => {
  return axios.delete(USER_URL + 'delete-tab/' + group);
};

/**
 * 删除标签
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const deleteApi = (id) => {
  return axios.delete(USER_URL + 'delete/' + id);
};

/**
 * 锁定标签组
 * @returns {AxiosPromise<any>}
 * @param group
 * @param lock
 */
export const lockTab = (group, lock) => {
  return axios.post(USER_URL + 'lock-tab/' + group, qs.stringify({ lock: lock }));
};

/**
 * 修改标签组名称
 * @returns {AxiosPromise<any>}
 * @param group
 * @param name
 */
export const modifyGroupName = (group, name) => {
  return axios.post(USER_URL + 'modify-group-name/' + group + '/' + name);
};
