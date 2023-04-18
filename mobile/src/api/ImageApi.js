import axios from 'axios';
import {
  removeHashStorage,
  removeItem, WASTE_BASKET_DATA
} from '../libs/Storage';
import { getServiceHost } from "./Api";

const IMAGE_URL = getServiceHost() + 'image/';

/**
 * 查询图片
 * @returns {AxiosPromise<any>}
 * @param page
 */
export const searchImage = (page) => {
  return axios.get(IMAGE_URL + 'search-images/' + page);
};

/**
 * 查询壁纸
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const searchWallpaper = (params) => {
  return axios.get(IMAGE_URL + 'search-wallpaper', { params: params });
};

/**
 * 删除文件
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const deleteImage = (id) => {
  return axios.delete(IMAGE_URL + 'delete-image/' + id);
};
