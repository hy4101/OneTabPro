import axios from "axios";
import { getServiceHost } from "./Api";

const WALLPAPER_URL = getServiceHost() + 'setting/';

const Qs = require('qs');

/**
 * 导入数据
 * @returns {Promise<unknown>}
 */
export const importData = (platform, params) => {
  return axios.post(WALLPAPER_URL + '/import/' + platform, params);
};
