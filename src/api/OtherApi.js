import axios from 'axios';
import { getServiceHost } from './Api';
import { getStorage, isAuthorization, setStorage } from '@/libs/Storage';
import { isEmpty, toast } from '@/libs/util';
import EventBus from '../libs/EventBus';

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
 * 查看标签记录
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getTabsApi = () => {
  return axios.get(USER_URL + 'get-tab');
};

/**
 * 查看收藏的标签
 * @returns {AxiosPromise<any>}
 */
export const getCollectTabs = () => {
  return axios.get(USER_URL + 'get-tab-collect');
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

/**
 * 收藏标签
 * @returns {AxiosPromise<any>}
 * @param tab
 */
export const collectApi = (tab) => {
  if (isAuthorization()) {
    axios.post(USER_URL + 'collect-tab/' + tab.id).then(res => {
      addCollectTab(res.data.data, tab.id);
    });
  } else {
    let sourceId = tab.id;
    let newTab = Object.assign({}, tab);
    newTab.sourceId = sourceId;
    newTab.id = new Date().getTime() + '';
    addCollectTab(newTab, sourceId);
  }
};

function addCollectTab (tab, sourceId) {
  let mes = '已收藏';
  if (isEmpty(tab)) {
    toast(mes);
    return;
  }
  let collectTabs = getStorage('collect_tabs');
  if (isEmpty(collectTabs)) {
    collectTabs = [];
  } else {
    collectTabs = JSON.parse(collectTabs);
  }
  let index = collectTabs.findIndex(s => s.sourceId === sourceId);
  if (index < 0) {
    collectTabs.splice(0, 0, tab);
    setStorage('collect_tabs', JSON.stringify(collectTabs));
    mes = '收藏成功';
  }
  toast(mes);
  EventBus.$emit('init_tab_data', false);
}
