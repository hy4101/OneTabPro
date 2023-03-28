/**
 * 跳转到选项页面
 * 同时将tab页固定
 */
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
  chrome.tabs.update({
    pinned: true
  });
});
