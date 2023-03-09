// chrome.webRequest.onResponseStarted.addListener(function (details, v, b) {
//     if (details.url.indexOf('list/?device_platform') > 0) {
//       console.log(11111111);
//       console.log(details);
//       console.log(v);
//       console.log(b);
//     }
//   },
//   { urls: ['<all_urls>'] }
// );

chrome.action.onClicked.addListener((tab) => {
  // if (tab.url.indexOf('chrome-extension:') < 0) {
  chrome.runtime.openOptionsPage();
  // setTimeout(() => {
  //   chrome.runtime.sendMessage({ type: 'get_advertising_key' }, (response) => {
  //   });
  // }, 800);
  // }
});
