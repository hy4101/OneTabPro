/**
 * 跳转到选项页面
 * 同时将tab页固定
 */

chrome.action.onClicked.addListener((tab) => {
  openOptionsPage();
  setTimeout(() => {
    chrome.runtime.sendMessage({ type: 'receive_tab' });
  }, 500);
});

/**
 * 初次安装
 *
 * 第一次安装监听
 *
 */
chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: 'one_tab_pro', title: 'OneTab Pro', contexts: ['all']
  });
  chrome.contextMenus.create({
    parentId: 'one_tab_pro', id: 'send_tab_to_one', title: '发送此标签页至标签组（默认第一组）', contexts: ['all']
  });
  chrome.contextMenus.create({
    parentId: 'one_tab_pro', id: 'send_tab_to_right', title: '发送右侧标签页', contexts: ['all']
  });
  chrome.contextMenus.create({
    parentId: 'one_tab_pro', id: 'send_tab_to_left', title: '发送左侧标签页', contexts: ['all']
  });
});

// 监听标签页切换事件
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(tab.index);
    // 判断是否只在右边有标签页时
    chrome.tabs.query({ pinned: true }, (tabs) => {
      let _tabs = tabs.filter(t => t.url.includes('chrome-extension://')).length;

      if (tab && tab.index - _tabs > 0) {
        chrome.contextMenus.update('send_tab_to_left', { enabled: true });
      } else {
        chrome.contextMenus.update('send_tab_to_left', { enabled: false });
      }
      // 获取所有标签页的信息
      chrome.tabs.query({}, (tabs) => {
        // 判断是否只在左边有标签页时
        if (tab && tab.index < tabs.length - 1) {
          // 更新菜单的可点击状态
          chrome.contextMenus.update('send_tab_to_right', { enabled: true });
        } else {
          // 更新菜单的不可点击状态
          chrome.contextMenus.update('send_tab_to_right', { enabled: false });
        }
      });
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

});

/**
 * 监听菜单被点击
 */
chrome.contextMenus.onClicked.addListener((params) => {
  if (params.menuItemId === 'send_tab_to_one') {
    send_tab_to_one();
  }
  if (params.menuItemId === 'send_tab_to_right') {
    send_tab_to_right_or_left('right');
  }
  if (params.menuItemId === 'send_tab_to_left') {
    send_tab_to_right_or_left('left');
  }
});

function send_tab_to_one () {
  chrome.tabs.query({
    active: true, currentWindow: true
  }, (tabs) => {
    openOptionsPage();
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'send_tab', tab: tabs[0] });
    }, 1000);
  });
}

/**
 * 发送标签到onetabpro
 *
 * @param send
 */
function send_tab_to_right_or_left (send) {
  chrome.tabs.query({}, (tabs) => {
    let currentIndex = tabs.filter(t => t.active)[0].index;
    let target = [];
    for (const tab of tabs) {
      if (tab.url.includes('chrome-extension://')) {
        continue;
      }
      if (send === 'left' && tab.index < currentIndex) {
        target.push(tab);
      }
      if (send === 'right' && tab.index > currentIndex) {
        target.push(tab);
      }
    }
    openOptionsPage();
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'one_tab_pro_send_right_or_left',
        tabs: target,
        groupName: send === 'left' ? '来自：发送左侧标签页' : '来自：发送右侧标签页'
      });
    }, 500);
  });
}

/**
 * 打开标签管理页
 */
function openOptionsPage () {
  chrome.runtime.openOptionsPage();
  chrome.tabs.update({
    pinned: true
  });
};
