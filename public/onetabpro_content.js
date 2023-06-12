chrome.contextMenus.onShown.addListener((info, tab) => {
  console.log('右键菜单已唤醒1', info, tab);
});
