import EventBus from './EventBus';
import { getHtml } from './oneTabExportTemplate.html.js';
import { getStorage } from './Storage';

/**
 * 判断属性是否空
 *  isEmpty 支持的类型如下：
 *    1、字符串：内容为空，返回 true，否则 false
 *    2、对象：对象为空，返回 true，否则 false
 *    3、数组：数组为空，返回 true，否则 false
 * @param str
 * @returns {boolean}
 */
export const isEmpty = (str) => {
  if (str === '' || str == null || str === 'undefined') {
    return true;
  }
  if (str instanceof Array) {
    if (str.length <= 0) {
      return true;
    }
  }
  if (str instanceof Object) {
    if (JSON.stringify(str) === '{}') {
      return true;
    }
  }
  return false;
};

/**
 * 生成 UUID：
 * @returns {string|boolean}
 */
export const uuid = () => {
  let temp_url = URL.createObjectURL(new Blob());
  let uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf('/') + 1);
};

export const i18n = (key) => {
  return chrome.i18n.getMessage(key);
};

/**
 * toast
 */
export const toast = (message, type = 'success') => {
  EventBus.$emit('system_message', { message, type });
};

export const dateFormatStr = (dateTime = new Date(), format = 'yyyy-MM-dd HH:mm:ss') => {
  let ret;
  const opt = {
    'y+': dateTime.getFullYear().toString(),
    'M+': (dateTime.getMonth() + 1).toString(),
    'd+': dateTime.getDate().toString(),
    'H+': dateTime.getHours().toString(),
    'm+': dateTime.getMinutes().toString(),
    's+': dateTime.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(format);
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
    }
  }
  return format;
};

/**
 * 获取浏览器信息
 * @returns {{name: string, version: string}|{name: string, version: string | string}}
 */
export const getExplorerInfo = () => {
  let explorer = window.navigator.userAgent;
  explorer = explorer.toLowerCase();
  if (explorer.indexOf('edg') >= 0) {
    let ver = explorer.match(/edg\/([\d.]+)/)[1] || '';
    return { name: 'edge', version: ver };
  } else if (explorer.indexOf('chrome') >= 0) {
    let ver = explorer.match(/chrome\/([\d.]+)/)[1] || '';
    return { name: 'Chrome', version: ver };
  } else if (explorer.indexOf('safari') >= 0) {
    let ver = explorer.match(/version\/([\d.]+)/)[1] || '';
    return { name: 'Safari', version: ver };
  }

  return { name: 'other', version: '' };
};

/**
 * 获取浏览器的标签
 */
export const getTabs = (callback) => {
  chrome.tabs.query({ currentWindow: true }, (res) => {
    let _target = [...res];
    let fixedTab = getStorage('fixed_tab') || 2;
    res.forEach((needSaveTab, v) => {
      if (needSaveTab.active || (needSaveTab.pinned && +fixedTab === 1)) {
        return;
      }
      chrome.tabs.remove(needSaveTab.id);
    });
    _target = _target.filter((item, index, self) => index === self.findIndex(t => t.url === item.url));
    let mine = [];
    for (let targetElement of _target) {
      if (targetElement.title === 'OneTab Pro') {
        continue;
      }
      // if (targetElement.url.startsWith('edge//newtab/') ||
      //   targetElement.url.startsWith('chrome://') ||
      //   targetElement.url.startsWith('edge://') ||
      //   targetElement.url.startsWith('chrome//') ||
      //   (targetElement.pinned && +fixedTab === 1)) {
      //   continue;
      // }
      mine.push(targetElement);
    }
    return callback(mine);
  });
};

/**
 * 将标签页数据导出Html文件
 */
export const exportHtml = (tabs) => {
  const content = getHtml(tabs);
  const link = document.createElement('a');
  link.download = 'index.html'; // 文件名
  link.style.display = 'none';
  const blob = new Blob([content], { type: 'text/html' });
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 打开网站
 */
export const openSite = (url) => {
  if (url.includes('https://') || url.includes('http://')) {
    // url = 'http://' + url;
    window.open(url, '_blank');
  } else {
    chrome.tabs.create({ url: url });
  }
};

/**
 * 实现将字符串转dom
 * @param xmlString
 * @returns {Document}
 */
export const parseXmlString = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'text/html');
};

/**
 * 防抖 当事件被触发后，等待一段时间再执行事件处理程序，如果在等待时间内事件再次被触发，则重新计时
 * @param callback
 * @param wait
 * @returns {(function(): void)|*}
 */
export const debounce = (callback, wait) => {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(context, args);
    }, wait);
  };
};

/**
 * 节流：当事件被触发后，在一段时间内只执行一次事件处理程序。这种技术可以用于限制频繁触发的事件，例如滚动事件或鼠标移动事件
 * @param callback
 * @param delay
 * @returns {(function(): void)|*}
 */
export const throttle = (callback, delay) => {
  let prev = Date.now();
  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - prev >= delay) {
      callback.apply(context, args);
      prev = Date.now();
    }
  };
};
