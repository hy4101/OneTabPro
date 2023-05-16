/**
 * 跳转到选项页面
 * 同时将tab页固定
 */

chrome.action.onClicked.addListener((tab) => {
  openOptionsPage();
  setTimeout(() => {
    chrome.runtime.sendMessage({ type: 'receive_tab' });
  }, 200);
});

/**
 * 初次安装
 *
 * 第一次安装监听
 *
 */
chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: 'OneTab_Pro',
    title: 'OneTab Pro — 发送至标签一组'
  });
});

/**
 * 监听菜单被点击
 */
chrome.contextMenus.onClicked.addListener((params) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    openOptionsPage();
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'send_tab', tab: tabs[0] });
    }, 1000);
  });
});

/**
 * 打开标签管理页
 */
function openOptionsPage () {
  chrome.runtime.openOptionsPage();
  chrome.tabs.update({
    pinned: true
  });
};
