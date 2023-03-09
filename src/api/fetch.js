const API_1 = 'https://api.miniits.com';
/**
 *
 * @param root
 * @returns {string}
 */
export const getServiceHost = (root = '/browser-desktop-server-api/') => {
  let prod = API_1 + root;
  return process.env.NODE_ENV === 'production' ? prod : 'http://127.0.0.1:20000' + root;
};

/**
 * 网络请求工具类
 */
class Fetch {
  /**
   * GET 请求
   * @param url
   * @param params
   * @param token
   * @returns {Promise<unknown>}
   */
  get (url, params, token = null) {
    if (params) {
      let paramsArray = [];
      Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&');
      } else {
        url += '&' + paramsArray.join('&');
      }
    }
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: {
          DeviceId: new Date().getTime(),
          Authorization: token
        }
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  /**
   * POST 请求
   * @param url
   * @param data
   * @param token
   * @returns {Promise<unknown>}
   */
  post (url, data, token = null) {
    return new Promise((resolve, reject) => {
      let _body = null;
      if (data) {
        _body = JSON.stringify(data);
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          DeviceId: new Date().getTime(),
          Authorization: token
        },
        body: _body
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  /**
   * PUT 请求
   * @param url
   * @param data
   * @param token
   * @returns {Promise<unknown>}
   */
  put (url, data, token = null) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          DeviceId: new Date().getTime(),
          Authorization: token
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  /**
   * DELETE 请求
   * @param url
   * @param data
   * @param token
   * @returns {Promise<unknown>}
   */
  delete (url, data, token = null) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          DeviceId: new Date().getTime(),
          Authorization: token
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve('数据删除成功!'))
        .catch(err => reject(err));
    });
  };
}

export default new Fetch();// ES6导出
