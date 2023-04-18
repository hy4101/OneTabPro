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
 * 锁定标签组
 * @returns {AxiosPromise<any>}
 * @param group
 * @param lock
 */
export const lockTab = (group, lock) => {
  return axios.post(USER_URL + 'lock-tab/' + group, qs.stringify({ lock: lock }));
};

/**
 * 获取字典的随机一条数据
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 * @param key
 */
export const getRandomDictValue = (key) => {
  return axios.get(getServiceHost() + 'dict/random/' + key);
};

/**
 * 删除短视频
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 * @param id
 */
export const deleteDictValue = (id) => {
  return axios.delete(getServiceHost() + 'dict/delete/' + id);
};

/**
 * 获取游戏数据
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 * @param type
 */
export const getGamesApi = (type = 'all') => {
  return axios.get(getServiceHost() + 'game/search/' + type);
};
