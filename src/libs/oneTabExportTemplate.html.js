export const getHtml = (tabs) => {
  let templateBody = '';
  for (let gr of tabs) {
    let tabGroupName = gr.tabGroupName || '未命名标签组';
    let length = gr.val ? gr.val.length : 0;
    templateBody += '  <div class="one-tab-pro-group-item">\n' +
      '    <div class="one-tab-pro-group-item-title">\n' +
      '      <h3>\n' +
      '        ' + tabGroupName + ' - ' + length + '个标签页 ' + gr.time + '\n' +
      '      </h3>\n' +
      '    </div>\n' +
      '    <div class="one-tab-group-list">';
    for (let grElement of gr.val) {
      let favIconUrl = grElement.favIconUrl || 'https://bdimage.miniits.com/common/onetab_pro_export_null_logo.png';
      let path = grElement.path;

      templateBody += '     <div class="one-tab-pro-a-item">\n' +
        '        <img src="' + favIconUrl + '">\n' +
        '        <a href="' + path + '">' + grElement.title + '</a>\n' +
        '      </div>';
    }
    templateBody += '    </div>\n' +
      '  </div>';
  }
  return template1 + templateBody + template2;
};

const template1 = '<!DOCTYPE html>\n' +
  '<html lang="en">\n' +
  '<head>\n' +
  '  <meta charset="UTF-8">\n' +
  '  <title>onetab pro标签页数据</title>\n' +
  '</head>\n' +
  '<body>\n' +
  '<div class="one-tab-pro-group">\n' +
  '  <div class="one-tab-pro-ad">\n' +
  '    <h1>OneTab Pro Site List</h1>\n' +
  '    <a href="http://www.bdtab.cn">安装BdTab新标签页插件</a>\n' +
  '  </div>';

const template2 = '</div>\n' +
  '</body>\n' +
  '<style>\n' +
  '  .one-tab-pro-group {\n' +
  '    display: flex;\n' +
  '    flex-direction: column;\n' +
  '    padding: 0 40px;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-pro-ad {\n' +
  '    display: flex;\n' +
  '    align-items: center;\n' +
  '  }\n' +
  '  .one-tab-pro-ad > h1 {\n' +
  '    flex: 1;\n' +
  '  }\n' +
  '  .one-tab-pro-ad > a {\n' +
  '    margin-left: 20px;\n' +
  '    font-weight: bold;\n' +
  '    font-size: 20px;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-pro-group-item-title {\n' +
  '    display: flex;\n' +
  '    flex-direction: column;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-pro-group-item-title > span {\n' +
  '    font-weight: bold;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-group-list {\n' +
  '    display: flex;\n' +
  '    flex-direction: column;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-pro-a-item {\n' +
  '    display: flex;\n' +
  '    align-items: center;padding: 4px 0;\n' +
  '  }\n' +
  '\n' +
  '  .one-tab-pro-a-item > img {\n' +
  '    width: 26px;\n' +
  '    height: 26px;\n' +
  '    margin-right: 8px;\n' +
  '  }\n' +
  '</style>\n' +
  '</html>\n';
