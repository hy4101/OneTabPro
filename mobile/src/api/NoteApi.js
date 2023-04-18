import axios from 'axios';
import { getServiceHost } from './Api';
import {
  GET_NOTES,
  getStorage,
  isAuthorization,
  setStorage
} from '../libs/Storage';
import { isEmpty } from '../libs/util';

export const NOTE_URL = getServiceHost() + 'note/';
const qs = require('qs');

/**
 * 浏览网页时的鼠标右键收藏：
 */
export const siteCollect = (content) => {
  return axios.post(NOTE_URL + 'site-collect-note', qs.stringify({ content: content }));
};

/**
 * 桌面新建笔记
 * @returns {AxiosPromise<any>}
 */
export const desktopAddNote = (note) => {
  return axios.post(NOTE_URL + 'desktop-add-2', qs.stringify(note));
};

/**
 * 修改笔记
 * @param id
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const updateNote = (id, params) => {
  getNotes().then((notes) => {
    notes = ff(notes, params);
    setStorage(GET_NOTES, JSON.stringify(notes));
  });

  if (!isAuthorization()) {
    return Promise.resolve(params);
  }

  return axios.post(NOTE_URL + 'update-note/' + id, qs.stringify({ content: params.content, title: params.title }));
};

/**
 * 查看服务端笔记列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getRemotelyNotes = () => {
  return axios.get(NOTE_URL + 'get-notes');
};

/**
 * 查看笔记列表
 * @returns {AxiosPromise<any>}
 * @param notExpand
 */
export const getNotes = (notExpand = true) => {
  let notes = getStorage(GET_NOTES);
  if (!isEmpty(notes)) {
    notes = JSON.parse(notes);
    if (!notExpand) {
      notes = ff(notes, null);
    }
  }
  if (isEmpty(notes)) {
    notes = [];
  }
  if (!isAuthorization()) {
    return Promise.resolve(notes);
  }
  return new Promise((resolve, reject) => {
    getRemotelyNotes().then((res) => {
      notes = res.data.data;
      // if (!isEmpty(notes)) {
      //   setStorage(GET_NOTES, JSON.stringify(notes));
      // }
      resolve(notes);
    });
  });
};

/**
 * 1、设置不展开
 * 2、更新笔记
 *
 * @param res
 * @param note
 * @returns {*}
 */
export const ff = (res, note) => {
  for (const re of res) {
    re.selected = false;
    if (!isEmpty(note)) {
      if (re.id === note.id) {
        re.title = note.title;
        re.content = note.content;
        note = null;
      }
    }
    if ('folder' === re.type) {
      re.expand = false;
      if (!isEmpty(re.children)) {
        ff(re.children, note);
      }
    }
  }
  return res;
};

/**
 * 删除笔记
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const deleteNote = (id) => {
  return axios.delete(NOTE_URL + 'delete-note/' + id);
};

/**
 * 移除笔记
 * @returns {AxiosPromise<any>}
 * @param id
 */
export const removeNoteApi = (id) => {
  return axios.delete(NOTE_URL + 'remove-note/' + id);
};

/**
 * 还原笔记
 * @param id
 * @param mandatory=true：强制还原，
 * @returns {AxiosPromise}
 */
export const reductionNote = (id, mandatory) => {
  return axios.post(NOTE_URL + 'reduction-note/' + id + '/' + mandatory);
};

/**
 * 查看移除的笔记
 * @returns {AxiosPromise<any>}
 * @param title
 */
export const selectDeleteNoteApi = (title) => {
  return axios.get(NOTE_URL + 'select-delete-note', qs.stringify({ title: title }));
};

/**
 * 编辑笔记标题
 * @returns {AxiosPromise<any>}
 * @param id
 * @param title
 */
export const editorTitle = (id, title) => {
  return axios.post(NOTE_URL + 'editor-note-title/' + id, qs.stringify({ title: title }));
};

/**
 *
 * move-note/{id}/{pid}
 *
 * 移动笔记
 * @returns {AxiosPromise<any>}
 * @param id
 * @param pid
 */
export const moveNote = (id, pid) => {
  return axios.post(NOTE_URL + 'move-note/' + id + '/' + pid);
};

/**
 * 获取笔记详情
 * @param id
 * @returns {AxiosPromise<any>}
 */
export const getNoteDetailApi = (id) => {
  return axios.get(NOTE_URL + 'get-note/' + id);
};


/**
 * 是否公开笔记
 * true = 是
 * false = 否
 *
 * @param id
 * @param open
 * @returns {AxiosPromise<any>}
 */
export const publicNoteApi = (id, open) => {
  return axios.post(NOTE_URL + 'open-note/' + id + '/' + open);
};


