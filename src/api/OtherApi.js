import axios from 'axios';
import { getServiceHost } from './Api';
import { getStorage, isAuthorization, setStorage } from '@/libs/Storage';
import { isEmpty, toast } from '@/libs/util';
import EventBus from '../libs/EventBus';

export const USER_URL = getServiceHost() + 'tab/';
export const TAB_GROUP_URL = getServiceHost() + 'tab-group/';
const qs = require('qs');
/**
 * 保存标签
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const saveTabsApi = (params) => {
  return axios.post(USER_URL + 'drag-tab', params);
};

/**
 * 新增标签组
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const saveTabGroupApi = (params) => {
  return axios.post(USER_URL + 'save-tab-group', params);
};

/**
 * 查看标签记录
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getTabsApi = () => {
  return axios.get(USER_URL + 'get-tab-group');
};

/**
 * 查看收藏的标签
 * @returns {AxiosPromise<any>}
 */
export const getCollectTabs = () => {
  return axios.get(USER_URL + 'get-tab-collect');
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
 * @param id
 * @param name
 */
export const modifyGroupName = (id, name) => {
  return axios.post(USER_URL + 'modify-group-name2/' + id + '/' + name);
};

/**
 * 设置排序
 * @param tabs
 * @returns {AxiosPromise<any>}
 */
export const setTabSort = (tabs) => {
  return axios.post(USER_URL + 'set-tab-sort', tabs);
};

/**
 * 收藏标签
 *
 * @returns {AxiosPromise<any>}
 * @param tab
 * @param type
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

/**
 * 导入收藏的标签
 * @param tabs
 */
export const collectImportApi = (tabs) => {
  if (isAuthorization()) {
    axios.post(USER_URL + 'collect-tab/import', tabs).then(res => {
      EventBus.$emit('initCollectTabData');
    });
  } else {
    for (let tab of tabs) {
      let sourceId = tab.id;
      let newTab = Object.assign({}, tab);
      newTab.sourceId = sourceId;
      newTab.id = new Date().getTime() + '';
      addCollectTab(newTab, sourceId);
    }
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

/**
 * 设置标签组的排序
 * @param ids
 * @returns {AxiosPromise<any>}
 */
export const setTabGroupSort = (ids) => {
  return axios.post(TAB_GROUP_URL + 'set-tab-group', ids);
};

/**
 * 删除标签组
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const deleteTabGroupApi = (id) => {
  return axios.delete(TAB_GROUP_URL + 'tab-group/' + id);
};

/**
 * 合并标签组
 * @param id
 * @param targetId
 * @returns {AxiosPromise}
 */
export const mergeTabGroup = (id, targetId) => {
  return axios.post(TAB_GROUP_URL + 'merge-group/' + id + '/' + targetId);
};

/**
 *
 * 优化合并功能，支持同时合并多组
 * @param ids
 * @returns {AxiosPromise<any>}
 */
export const mergeTabGroup2 = (ids) => {
  return axios.post(TAB_GROUP_URL + 'merge-group2', ids);
};
