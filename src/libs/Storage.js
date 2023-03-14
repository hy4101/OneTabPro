/* eslint-disable */
import { isEmpty } from './util';

export const USER_INFO_KEY = 'user_info';

export const CACHE_TABS_GROUP = 'cache_tabs_group';
export const COLLECT_TABS = 'collect_tabs';

export const setStorage = (key, val) => {
  if (isEmpty(val)) {
    removeItem(key);
    return;
  }
  localStorage.setItem(key, val);
};

/**
 * 根据key获取缓存数据
 * @param key
 * @returns {string}
 */
export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const removeItem = (key) => {
  localStorage.removeItem(key)
};

export const getChromeCache = async (key) => {
  return new Promise((resolve => {
    chrome.storage.local.get(key, (res) => {
      resolve(res[key]);
    });
  }))
};
export const setChromeCache = (key, val) => {
  if (isEmpty(val)) {
    return;
  }
  chrome.storage.local.set({
    [key]: val
  });
};
export const removeChromeCache = (key) => {
  chrome.storage.local.remove(key);
};
/**
 * 获取用户的 token
 * @returns {Object}
 */
export const getAuthorization = () => {
  let userInfo = getUserInfo();
  if (isEmpty(userInfo)) {
    return null;
  }
  let token = userInfo.authorization;
  return isEmpty(token) ? '' : token;
};

/**
 * true = 已登录
 * false = 未登录
 * @returns {boolean}
 */
export const isAuthorization = () => {
  const token = getAuthorization();
  return !isEmpty(token);
};


/**
 * 设置用户信息
 * @param userInfo
 */
export const setUserInfo = (userInfo) => {
  removeUserInfo();
  setStorage(USER_INFO_KEY, JSON.stringify(userInfo));
};

/**
 * 获取用户信息
 * @param userInfo
 */
export const getUserInfo = () => {
  let userInfo = getStorage(USER_INFO_KEY);
  return isEmpty(userInfo) ? {} : JSON.parse(userInfo);
};

/**
 * 删除（退出）用户信息
 * @param userInfo
 */
export const removeUserInfo = () => {
  removeItem(USER_INFO_KEY);
};

/**
 * map 缓存
 * @param key
 * @param item
 * @param val
 */
export const setHashStorage = (key, item, val) => {
  let hashMap = getStorage(key);
  if (!isEmpty(hashMap)) {
    hashMap = JSON.parse(hashMap);
  } else {
    hashMap = {};
  }
  if (isEmpty(val)) {
    delete hashMap[item];
  } else {
    hashMap[item] = val;
  }
  if (isEmpty(hashMap)) {
    removeItem(key);
    return;
  }
  setStorage(key, JSON.stringify(hashMap));
};

/**
 * 获取 map
 * @param key
 * @param item
 * @param val
 */
export const getHashStorage = (key, item) => {
  let hashMap = getStorage(key);
  let val = null;
  if (!isEmpty(hashMap)) {
    hashMap = JSON.parse(hashMap);
    if (item instanceof Number) {
      item = item + '';
    }
    val = hashMap[item];
  }

  return val;
};

/**
 * 移除 map 缓存
 * @param key
 * @param item
 * @param val
 */
export const removeHashStorage = (key, item) => {
  let hashMap = getStorage(key);
  if (isEmpty(hashMap)) {
    return;
  }
  hashMap = JSON.parse(hashMap);
  if (item instanceof Number) {
    item = item + '';
  }
  delete hashMap[item];

  setStorage(key, JSON.stringify(hashMap));
};
