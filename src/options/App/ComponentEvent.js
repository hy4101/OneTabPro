/**
 * 获取组件
 * @param id
 * @param component
 */
import {
  COMPONENT_IDS,
  COMPONENTS, getHashStorage,
  getStorage,
  removeHashStorage,
  setHashStorage,
  setStorage
} from '../../libs/Storage';

/**
 * 缓存组件
 * @param component
 */
export const cacheComponents = (component) => {
  let source = getHashStorage(COMPONENTS, component.id);
  if (source && source.config) {
    component.config = source.config;
  }
  setHashStorage(COMPONENTS, component.id, component);
  resetUseComponentIds();
};

/**
 * 删除缓存组件
 * @param id
 * @param component
 */
export const removeCacheComponents = (id) => {
  removeHashStorage(COMPONENTS, id);
  resetUseComponentIds();
};

/**
 * 重置使用中的组件id
 */
export const resetUseComponentIds = () => {
  let cs = getStorage(COMPONENTS);
  cs = JSON.parse(cs);
  let ics = [];
  for (const field in cs) {
    if ('enable' === cs[field].status) {
      ics.push(cs[field].id);
    }
  }
  setStorage(COMPONENT_IDS, JSON.stringify(ics));
  // Bus.$emit('change_component_status');
};
