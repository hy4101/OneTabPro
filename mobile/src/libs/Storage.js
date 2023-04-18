/* eslint-disable */
import { isEmpty } from './util';

export const DEFAULT_COMPONENT_LOGO = 'https://bdimage.miniits.com/components/default_component_logo.png';
export const TEMPORARY_ID_DESKTOP_ID = 'temporary_id_desktop_' + new Date().getTime();
export const TEMPORARY_ID_TOOL_ID = 'temporary_id_tool_' + new Date().getTime();
export const SYSTEM_INIT_APP_ID = 'system_init_app_id_' + new Date().getTime();
export const CURRENT_RIGHT_SELECT_APPLICATIONS = 'current-right-select-applications';
export const DESKTOP_APPS = 'desktop_apps'; // 用户的桌面 app 数据
export const USER_LAYOUT_APPLICATIONS = 'user_layout_applications'; // 已布局好的数据桌面数据
export const USER_POPUP_LAYOUT_APPLICATIONS = 'user_popup_layout_applications'; // 已布局好的数据桌面数据（popup页面使用）
export const USER_TOOL_APPLICATIONS = 'user_tool_applications'; // 用户的工具栏的 app 数据
export const GLOBAL_SEARCH = 'global_search'; // 记录当前搜索的关键词
export const GET_GLOBAL_SEARCH = 'get_global_search'; // 获取当前搜索的关键词
export const GET_TABS = 'get_tabs'; // 获取用户（服务端）所有标签
export const PULL_BROWSER_BOOKMARKS = 'pull_browser_bookmarks'; // 获取用户（浏览器）所有标签/同步数据
export const CLOSE_TABS_AND_SAVE = 'close_tabs_and_save'; // 关闭所有标签
export const CACHE_TABS_GROUP = 'cache_tabs_group'; // 缓存标签组
export const DELETE_TABS = 'delete_tabs'; // 删除标签

export const SIDEBAR_OPERATION_GROUP = 'sidebar_operation_group'; // 书签侧边栏操作按钮组
export const SIDEBAR_OPERATION_PRIVATE = SIDEBAR_OPERATION_GROUP + '_private'; // 设为私密
export const SIDEBAR_OPERATION_DESKTOP = SIDEBAR_OPERATION_GROUP + '_desktop'; // 添加到桌面
export const SIDEBAR_OPERATION_TOOL = SIDEBAR_OPERATION_GROUP + '_tool'; // 添加到工具栏
export const SIDEBAR_OPERATION_DELETE = SIDEBAR_OPERATION_GROUP + '_delete'; // 删除书签
export const SIDEBAR_OPERATION_DELETE_HISTORY = SIDEBAR_OPERATION_GROUP + '_delete_history'; // 删除历史记录
export const WASTE_BASKET_DATA = 'waste_basket_data'; // 回收站的数据
export const GET_DESKTOP_APPLICATION = 'get_desktop_application'; // 只存储桌面应用
export const GET_POPUP_DESKTOP_APPLICATION = 'get_popup_desktop_application'; // 只存储popup桌面应用,不含系统应用

export const TOKEN_KEY = 'Authorization';
export const DEVICE_ID = 'device_id';
export const USER_INFO_KEY = 'user_info';

export const CURRENT_GLOBAL_Z_INDEX = 'current_global_z_index'; // 记录全局 zindex
export const SETTING_GLOBAL_Z_INDEX = 'setting_global_z_index'; // 记录全局 zindex
// export const GETTING_GLOBAL_Z_INDEX = 'getting_global_z_index'; // 获取全局 zindex
export const FAVORITES_OR_UN_FAVORITES_SITE = 'favorites_or_un_favorites_site'; // 收藏或取消收藏
export const SAVE_ADVERTISING = 'save_advertising'; // 保存被标记的广告数据key
export const DELETE_ADVERTISING_HOST = 'delete_advertising_host'; // 保存被标记的广告数据key
export const GET_ADVERTISING_KEY = 'get_advertising'; // 标记的广告数据key
export const ADVERTISING_KEY = 'mark_advertising'; // 标记的广告数据key
export const REMOVE_HASH_STORAGE = 'remove_hash_storage'; // 清楚缓存的key
export const ADVERTISING_KEY_ALL = ADVERTISING_KEY + '_all'; // 后台记录所有站点标记广告数据的key
export const IS_HIDE_ELEMENT = 'is_hide_element'; // 是否隐藏元素
export const IS_SEARCH = 'is_search'; //
export const BROWSER_DESKTOP_SETTING = 'browser_desktop_setting'; // 浏览器桌面设置
export const SETTING_SWITCH_SEARCH_ENGINE = 'setting_switch_search_engine'; // 切换搜索引擎状态
export const CREATE_MENUS = 'create_menus'; // 创建菜单
export const ADD_AS_BOOKMARK = 'add_as_bookmark'; // 添加到书签
export const ADD_AS_DESKTOP = 'add_as_desktop'; // 添加网页到主页
export const ADD_AS_TOOL = 'add_as_tool'; // 添加网页到主页
export const FAVORITE_SELECTED_CONTENT = 'favorite_selected_content'; // 收藏选中的文本
export const FAVORITE_PICTURE = 'favorite_picture'; // 收藏图片
export const SET_AS_WALLPAPER = 'set_as_wallpaper'; // 设置为BdTab主页壁纸
export const SHIBUSHIGENXINTUBIAO = 'shibushigenxintubiao'; // 是不是更新网站logo
export const HISTORY_USE_SEARCH_ENGINE = 'history_use_search_engine'; // 之前使用的搜索引擎
export const SET_HISTORY_USE_SEARCH_ENGINE = 'set_history_use_search_engine'; // 设置当前使用的搜索引擎
export const SEARCH_ENGINE_DATA = 'search_engine_data'; // 缓存用户下的搜索引擎数据的key
export const SEARCH_ENGINE_SUGGESTION_BAIDU_DATA = 'search_engine_suggestion_baidu_data'; // 搜索引擎建议数据
export const GENERATE_QR_CODE = 'generate_qr_code'; // 生成二维码
export const IS_SHOW_BOOKMARKS = 'is_show_bookmarks'; // 加载页面完成后是否显示书签栏
export const USER_PIN = 'user_pin_ps'; // 加载页面完成后是否显示书签栏

export const MESSAGE_TYPE_GET_BOOKMARKS = 'message_type_get_bookmarks'; // 所有书签的数据
export const REMOVE_MESSAGE_TYPE_GET_BOOKMARKS = 'remove_message_type_get_bookmarks'; // 所有书签的数据
export const REMOVE_SOURCE_IMAGE = 'remove_source_image'; // 所有书签的数据
export const UPDATE_GET_BOOKMARKS = 'update_get_bookmarks'; // 更新所有书签的数据
export const MESSAGE_TYPE_CLEAR_BOOKMARKS = 'message_type_clear_bookmarks'; // 清除所有本地缓存的书签数据
export const MESSAGE_TYPE_GET_TABS = 'message_type_get_tabs';

export const MESSAGE_TYPE_GET_HISTORY = 'message_type_get_history'; // 获取历史数据
export const APPLICATION_STORE = 'application_store'; // 获取应用商店数据
export const APPLICATION_STORE_TYPE = 'application_store_type'; // 获取应用分类数据
export const IS_AUTHORIZATION = 'is_authorization'; // 判断是否登录了
export const OPEN_BOOKMARKS = 'open_bookmarks'; // 打开书签
export const LAST_LOGIN_EMAIL = 'last_login_email'; // 记录最近一次登录的邮箱号
export const SEARCH_ENGINE_STORE = 'search_engine_store'; // 缓存搜索引擎数据
export const CURRENT_USE_WALLPAPER = 'current_use_wallpaper'; // 当前使用的壁纸
export const CURRENT_USE_WALLPAPER_COLOR = 'current_use_wallpaper_color'; // 当前使用的背景颜色
export const SET_TEMPORARY_SITE_ICON = 'set_temporary_site_icon_'; // 临时的站点图标
export const GET_NOTES = 'get_notes'; // 笔记
export const APP_NAME_COLOR = 'app_name_color'; // app的名称颜色
export const DESKTOP_BG_COLOR = 'desktop_bg_color'; // 是否启用桌面背景颜色
export const DESKTOP_BG_COLOR_TYPE = 'color'; // 历史桌面背景颜色
export const SEARCH_BOX_BACKGROUND_COLOR = 'search_box_background_color'; // 聚合搜索的背景色

export const DESKTOP_SHOW_APP_NAME = 'desktop_show_app_name'; // 是否显示桌面app的名称
export const SHOW_RECORD_NUMBER = 'show_record_number'; // 显示或隐藏底部的网站备案号：“备案号：闽ICP备17023906号-7”
export const shibushigenxintubiao = 'shibushigenxintubiao';
export const COMPONENTS = 'components';

/**
 * 设置过期时间的方法
 * @param key
 * @param val
 * @param expire 过期时间 / s
 */
export const setStorageExpire = (key, val, expire) => {
  let obj = {
    data: val,
    time: Date.now(),
    expire: expire
  };
  setStorage(key, JSON.stringify(obj));
  // chrome.storage.local.set({
  //   [key]: JSON.stringify(obj)
  // });
};

/**
 * 超时
 * @param key
 * @returns {string|null|*}
 */
export const getStorageExpire = (key) => {
  let val = getStorage(key);
  if (!val) {
    return val;
  }
  val = JSON.parse(val);
  if (Date.now() - val.time > val.expire) {
    removeItem(key);
    return null;
  }
  return val.data;
};

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

/**
 * 清除全部
 */
export const removeAll = () => {
  localStorage.clear();
};

/**
 * 退出登录
 */
export const logout = () => {
  removeItem("Authorization");
  let userInfo = getUserInfo();
  userInfo.authorization = null;
  setUserInfo(userInfo);
};

/**
 *
 * @param key
 * @param val
 * @param expired 过期时间/单位秒
 */
export const setStorageExpired = (key, val, expired) => {
  let d = { data: val, expired: expired };
  setStorage(key, JSON.stringify(d));
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

/**
 * 获取用户的 token
 * @returns {string|boolean}
 */
export const getAuthorization = () => {
  let token = getStorage(TOKEN_KEY);
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
 * 获取用户信息
 * @param userInfo
 */
export const getUserInfo = () => {
  let userInfo = getStorage(USER_INFO_KEY);
  return isEmpty(userInfo) ? {} : JSON.parse(userInfo);
};

/**
 * 设置用户信息
 * @param userInfo
 */
export const setUserInfo = (userInfo) => {
  setStorage(USER_INFO_KEY, JSON.stringify(userInfo));
  setStorage(TOKEN_KEY, userInfo.authorization);

};
