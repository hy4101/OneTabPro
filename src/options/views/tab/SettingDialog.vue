<template>
  <div class="otp-setting">
    <el-dialog title="设置" :visible.sync="settingDialogVisible" width="50%"
               :before-close="closeDialog">
      <div class="otp-setting-dialog">
        <div class="otp-setting-dialog-item">
          <label>打开标签后删除标签：</label>
          <el-radio-group v-model="radio" size="medium" @change="settingOpenDeleteSite">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </div>
        <div class="otp-setting-dialog-item">
          <label>导入：</label>
          <input type="file" ref="fileInput" @change="onChange">
        </div>

        <a href="https://www.miniits.com/note/open?id=1680169521620" target="_blank"
           style="margin-top: 20px">使用教程</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from '../../../libs/Storage';
import { isEmpty, parseXmlString, toast } from '../../../libs/util';
import EventBus from '../../../libs/EventBus';
import { collectApi, collectImportApi } from '../../../api/OtherApi';

export default {
  name: 'SettingDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.settingDialogVisible = v;
      }
    }
  },
  data () {
    return {
      radio: 2,
      settingDialogVisible: false
    };
  },
  methods: {
    onChange (e) {
      let reader = new FileReader();
      reader.readAsText(e.target.files[0], 'UTF-8');
      reader.onload = (e) => {
        let fileContent = e.target.result;
        if (fileContent.indexOf('one-tab-pro-group-item') < 0) {
          return toast('文件格式错误（只允许导出后的文件格式）', 'error');
        }
        let dom = parseXmlString(fileContent);
        let groupDom = dom.getElementsByClassName('one-tab-pro-group-item');
        let groupData = [];
        let collectTabs = [];
        for (let i = 0; i < groupDom.length; i++) {
          let baseTime = new Date().getTime();
          ++baseTime;
          let groupElement = groupDom[i];
          let groups = groupElement.getElementsByClassName('one-tab-pro-group-item-title')[0].childNodes[1].innerText;
          let tabGroupName = groups.replace(/\s/g, '').split('-');
          let siteDom = groupElement.getElementsByClassName('one-tab-pro-a-item');
          let res = [];
          for (let siteDomElement of siteDom) {
            let image = siteDomElement.children[0].src;
            let path = siteDomElement.children[1].href;
            let title = siteDomElement.children[1].innerText;
            let tabItem = {
              url: path,
              path: path,
              favIconUrl: image,
              title: title,
              id: ++baseTime,
              index: i,
              tabGroup: baseTime,
              tabGroupName: tabGroupName[0]
            };
            tabItem.tabGroupName = tabGroupName[0];
            res.push(tabItem);
          }
          if (i === 0 && groups.indexOf('我的收藏') >= 0) {
            for (let item of res) {
              collectTabs.push(item);
            }
            continue;
          }
          let time = groups.split('个标签页 ')[1].replace(/\n/g, '');
          let sites = res.filter(s => !s.path.startsWith('chrome://newtab/') && !s.path.startsWith('chrome-extension://'));
          if (isEmpty(sites)) {
            continue;
          }

          let groupItem = {
            time: time,
            tabGroup: new Date().getTime() + i,
            lock: false,
            val: sites,
            tabGroupName: tabGroupName[0]
          };
          groupData.push(groupItem);
        }
        if (!isEmpty(collectTabs)) {
          collectImportApi(collectTabs);
        }
        for (let reverseElement of groupData.reverse()) {
          EventBus.$emit('saveTabs', reverseElement);
        }
        toast('导入成功');
        this.$refs.fileInput.value = null;
        this.closeDialog();
      };
    },
    settingOpenDeleteSite () {
      setStorage('delete_site', this.radio);
    },
    closeDialog () {
      this.settingDialogVisible = false;
      this.$emit('close');
    }
  },
  mounted () {
    let ds = getStorage('delete_site') || 2;
    this.radio = +ds;
  }
};
</script>

<style lang="less" scoped>
.otp-setting {
  .otp-setting-dialog {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .otp-setting-dialog-item {
      margin-top: 10px;
    }
  }
}
</style>
