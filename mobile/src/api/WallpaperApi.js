import axios from 'axios';
import { isEmpty } from '@/libs/util';
import { getHashStorage, getStorage, isAuthorization, setHashStorage, setStorage } from '@/libs/Storage';
import { getServiceHost } from './Api';
import { CURRENT_USE_WALLPAPER, getUserInfo, removeItem, setUserInfo } from '../libs/Storage';

const qs = require('qs');

const WALLPAPER_URL = getServiceHost() + 'wallpaper/';
export const WALLPAPER_TYPE = 'wallpaper_type';
const WALLPAPER_BY_KEY = 'wallpaper_by_key';

/**
 * 获取壁纸分类
 *
 * @returns {AxiosPromise<any>}
 */
export const getWallpaperType = () => {
  return new Promise((resolve, reject) => {
    let types = getStorage(WALLPAPER_TYPE);
    if (isEmpty(types)) {
      axios.get(WALLPAPER_URL + 'type').then((res) => {
        let ws = res.data.data;
        setStorage(WALLPAPER_TYPE, JSON.stringify(ws));
        resolve(ws);
      });
    } else {
      resolve(JSON.parse(types));
    }
  });
};

/**
 * 获取某类别下的壁纸
 * @returns {Promise<unknown>}
 */
export const getWallpaperByType = (type, page) => {
  let cacheKey = WALLPAPER_TYPE + type;
  return new Promise((resolve, reject) => {
    let wallpapers = getHashStorage(cacheKey, page + '');
    if (isEmpty(wallpapers)) {
      axios.get(WALLPAPER_URL + 'get-by-type', { params: { type: type, page: page } }).then((res) => {
        let ws = res.data.data;
        if (!isEmpty(ws) && 'used_already' !== type) {
          setHashStorage(cacheKey, page + '', ws);
        }
        resolve(ws);
      });
    } else {
      resolve(wallpapers);
    }
  });
};

/**
 * 获取某类别下的壁纸
 * @returns {Promise<unknown>}
 */
export const getWallpaperByKey = (key, page) => {
  let cacheKey = WALLPAPER_BY_KEY + key + page;
  return new Promise((resolve, reject) => {
    let types = getStorage(cacheKey);
    if (isEmpty(types)) {
      axios.get(WALLPAPER_URL + 'get-by-key', { params: { key: key, page: page } }).then((res) => {
        let ws = res.data.data;
        setStorage(cacheKey, JSON.stringify(ws));
        resolve(ws);
      });
    } else {
      resolve(JSON.parse(types));
    }
  });
};

/**
 * 设置背景
 * @returns {Promise<unknown>}
 */
export const settingBackground = (imageOrColor, type = 'image') => {
  if ('image' === type) {
    setStorage(CURRENT_USE_WALLPAPER, imageOrColor);
    removeItem(WALLPAPER_TYPE + 'used_already');
    if (isAuthorization()) {
      let userInfo = getUserInfo();
      userInfo.wallpapers = imageOrColor;
      userInfo.backgroundUseType = 'image';
      setUserInfo(userInfo);
    }
  }
  if (!isAuthorization()) {
    return Promise.resolve();
  }
  return axios.post(WALLPAPER_URL + 'setting-background/' + type, qs.stringify({ imageOrColor: imageOrColor }));
};

/**
 * 获取历史使用的背景颜色
 * @param type
 * @returns {AxiosPromise<any>}
 */
export const getHistoryBackgroundColor = (type) => {
  return axios.get(WALLPAPER_URL + 'get-history-background-color/' + type);
};

/**
 * 获取每日壁纸
 * @param type
 * @returns {AxiosPromise<any>}
 */
export const getTodayWallpaper = () => {
  return axios.get(WALLPAPER_URL + 'today');
};

/**
 * 获取收藏的壁纸
 * @returns {Promise<unknown>}
 */
export const getFavoriteWallpaper = (type) => {
  return axios.get(WALLPAPER_URL + 'find-by-type/' + type);
};

/**
 * 收藏背景
 * @returns {Promise<unknown>}
 */
export const addCollection = (imageUrl) => {
  return axios.post(WALLPAPER_URL + 'collection', qs.stringify({ imageUrl: imageUrl }));
};

/**
 * 删除历史壁纸
 * @returns {Promise<unknown>}
 */
export const deleteHistoryWallpaper = (id) => {
  return axios.delete(WALLPAPER_URL + 'delete-history-wallpaper/' + id);
};
