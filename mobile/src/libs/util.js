import { DEVICE_ID, getStorage, setStorage } from "./Storage";
import { Message } from 'view-design';

export const UPDATE_TOOL_APPLICATION = 'update_tool_application';
export const GET_VERSION = {
  name: 'get_version',
  appid: 'bookmark'
};
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
 * 正则表达式判断网址是否有效
 * @param url
 * @returns {boolean}
 */
export const isURL = (url) => {
  let match2 = /^((http|ftp|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/;
  return match2.test(url);
};

/**
 * 根据网站url获取host：
 */
export const getHost = (urlString) => {
  if (isEmpty(urlString)) {
    return null;
  }
  let index = urlString.indexOf('://');
  if (index !== -1) {
    urlString = urlString.substring(index + 3);
  }
  index = urlString.indexOf('/');
  if (index !== -1) {
    urlString = urlString.substring(0, index);
  }
  return urlString;
};

export const downloadImage = (imageUrl, name) => {
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imageUrl;
};

/**
 * 获取当前设备上浏览的随机id：
 * @returns {string|boolean}
 */
export const getDeviceId = () => {
  let deviceId = getStorage(DEVICE_ID);
  if (isEmpty(deviceId)) {
    deviceId = uuid();
    setStorage(DEVICE_ID, deviceId);
  }
  return deviceId;
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

/**
 * 插入样式
 * @param styleValue
 */
export const insertStyle = (styleValue) => {
  var style = document.createElement('style');
  style.innerHTML = styleValue;
  document.getElementsByTagName('head')[0].appendChild(style);
};

export const dateFormatStr = (dateTime = new Date(), format = "yyyy-MM-dd HH:mm:ss") => {
  let ret;
  const opt = {
    "y+": dateTime.getFullYear().toString(),        // 年
    "M+": (dateTime.getMonth() + 1).toString(),     // 月
    "d+": dateTime.getDate().toString(),            // 日
    "H+": dateTime.getHours().toString(),           // 时
    "m+": dateTime.getMinutes().toString(),         // 分
    "s+": dateTime.getSeconds().toString()          // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(format);
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
    }
  }
  return format;
};

export const downloadUrlFile = (fileName, url) => {
  if (!url.includes(';base64,')) {
    urlToBase64(url).then((res) => {
      downloadBase64File(fileName, res);
    });
  } else {
    downloadBase64File(fileName, url);
  }
};

export const downloadBase64File = (fileName, base64) => {
  let aLink = document.createElement('a');
  let blob = base64ToBlob(base64); // new Blob([content]);
  let evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));// 兼容火狐
};

/**
 * base64 转 blob
 * @returns {Blob}
 * @param base64
 */
export const base64ToBlob = (base64) => {
  let parts = base64.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  // return new Blob([uInt8Array], {type: contentType});
  let bdata = new Blob([uInt8Array], { type: contentType });
  return window.URL.createObjectURL(bdata);
};

/**
 * url 转 base64
 * @returns {string}
 * @param url
 * @param quality
 */
export const urlToBase64 = (url, quality) => {
  return new Promise((resolve, reject) => {
    var Img = new Image();
    var dataURL = '';
    Img.setAttribute('crossOrigin', 'Anonymous');
    Img.src = url;
    Img.onload = function () {
      // 要先确保图片完整获取到，这是个异步事件
      var canvas = document.createElement('canvas'); // 创建canvas元素
      var width = Img.width; // 确保canvas的尺寸和图片一样
      var height = Img.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height); // 将图片绘制到canvas中
      if (quality) {
        dataURL = canvas.toDataURL('image/jpeg', quality); // 转换图片为dataURL
      } else {
        dataURL = canvas.toDataURL('image/jpeg'); // 转换图片为dataURL
      }
      resolve(dataURL);
    };
  });
};

/**
 * 是否是内嵌
 *
 * true = 是
 * false = 否
 *
 * @returns {boolean}
 */
export const isIframe = () => {
  return self !== top;
};

export const toast = (message, type = 'info') => {
  Message[type](message);
};

/**
 * 获取插件版本
 */
export const getVersion = () => {
  let version = getStorage(GET_VERSION.name);
  if (isEmpty(version)) {
    return null;
  }
  version = version.replace(/\./g, '');
  return Number(version);
};

/**
 * 1、跳转到玩游戏界面
 *
 * 2、添加历史玩过的游戏
 */
export const goPlayGame = (self, game) => {
  self.$router.push({
    name: isIframe() ? 'play-game-iframe.html' : 'play-game.html',
    query: { url: game.url, image: game.image, name: game.name }
  });

  let history = getStorage('history-game');
  if (isEmpty(history)) {
    history = [];
  } else {
    history = JSON.parse(history);
  }
  let index = history.findIndex(g => g.id === game.id);
  if (index >= 0) {
    history.splice(index, 1);
  }
  history.splice(0, 0, game);
  setStorage('history-game', JSON.stringify(history));
};

/**
 * 获取随机数
 * @param min
 * @param max
 * @returns {number}
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
