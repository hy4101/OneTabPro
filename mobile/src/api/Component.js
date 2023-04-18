import { getServiceHost } from "@/api/Api";
import axios from "axios";
import { COMPONENTS, getHashStorage, getStorage, removeHashStorage, setHashStorage } from "@/libs/Storage";
import { isEmpty } from "@/libs/util";

const COMPONENT_URL = getServiceHost() + 'component/';

const qs = require('qs');

/**
 * 保存组件
 * @param component
 * @returns {AxiosPromise<any>}
 */
export const saveComponentInfo = (component) => {
  return axios.post(COMPONENT_URL + 'save-component', component);
};

/**
 * 保存组件的设置信息
 * @param component
 * @returns {AxiosPromise<any>}
 */
export const saveComponentSettingInfo = (component) => {
  return axios.post(COMPONENT_URL + 'save-component/setting-dialog', component);
};

/**
 * 用户安装组件
 * @param id
 * @returns {AxiosPromise<any>}
 */
export const installComponent = (id) => {
  return axios.post(COMPONENT_URL + 'install-component/' + id);
};

/**
 * 删除组件
 * @param id
 * @returns {AxiosPromise<any>}
 */
export const deleteComponent = (id) => {
  return axios.delete(COMPONENT_URL + id);
};

/**
 * 查询系统/用户组件
 * @param type
 * @returns {AxiosPromise<any>}
 */
export const searchComponent = (type) => {
  return axios.get(COMPONENT_URL + 'search-components/' + type);
};

/**
 * 查询系统组件
 * @param page
 * @param componentName
 * @returns {AxiosPromise<any>}
 */
export const searchOtherComponent = (page, componentName) => {
  return axios.get(COMPONENT_URL + 'search-components/other/' + page + "?componentName=" + componentName);
};

/**
 * 修改组件状态
 * @param id
 * @param status
 * @returns {AxiosPromise<any>}
 */
export const settingComponentStatus = (id, status) => {
  return axios.post(COMPONENT_URL + 'status/' + id, qs.stringify({ status: status }));
};

/**
 * 设置组件的展示位置（X，Y轴）
 * @param id
 * @param x
 * @param y
 * @returns {AxiosPromise<any>}
 */
export const settingLocation = (id, x, y) => {
  return axios.post(COMPONENT_URL + 'setting-component-location', qs.stringify({ id: id, x: x, y: y }));
};

/**
 * 获取已安装的组件id
 */
export const getInstalledIds = () => {
  let cs = JSON.parse(getStorage(COMPONENTS));
  let ics = [];
  for (const field in cs) {
    ics.push(cs[field].componentId);
  }
  return ics;
};

/**
 * 缓存组件
 * @param component
 */
export const cacheComponents = (component) => {
  if (isEmpty(component.id)) {
    return;
  }
  setHashStorage(COMPONENTS, component.id, component);

  /**
   * 向父iframe发消息,设置组件
   */
  window.parent.postMessage({
    name: 'setting_component',
    component: component
  }, '*');
};

/**
 * 缓存组件的设置窗口数据，（html,js,css）
 * @param component
 */
export const cacheComponentSettingInfo = (component) => {
  if (isEmpty(component.id)) {
    return;
  }

  let source = getHashStorage(COMPONENTS, component.id);
  source.settingHtml = component.settingHtml;
  source.settingJavaScript = component.settingJavaScript;
  source.settingStyle = component.settingStyle;

  cacheComponents(source);
};

/**
 * 删除缓存组件
 * @param id
 * @param component
 */
export const removeCacheComponents = (id) => {
  removeHashStorage(COMPONENTS, id);

  /**
   * 向父iframe发消息,删除组件
   */
  window.parent.postMessage({
    get: 'delete_component',
    id: id
  }, '*');
};

/**
 * 上传组件
 * @param id
 * @returns {AxiosPromise<any>}
 */
export const uploadComponent = (id) => {
  return axios.post(COMPONENT_URL + 'upload-component/' + id);
};

/**
 * 启用组件
 * @param id
 * @param status
 * @returns {AxiosPromise<any>}
 */
export const changeComponentApi = (id, status) => {
  return axios.post(COMPONENT_URL + 'change-component/' + id + "/" + status);
};

/**
 * 配置组件信息
 * @param id
 * @param config
 * @returns {AxiosPromise<any>}
 */
export const settingComponentConfig = (id, config) => {
  return axios.post(COMPONENT_URL + 'config-component/' + id, qs.stringify({ config: config }));
};
