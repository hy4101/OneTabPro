<template>
  <div class="otp-merge-group">
    <el-dialog title="合并分组" :visible.sync="mergeGroupDialogVisible" width="40%"
               :before-close="closeDialog">
      <div class="otp-merge-group-dialog">
        <div class="otp-group-from otp-group-layout">
          <div v-for="(item,index) in 50" class="otp-group-item">
            {{ index }}合并到
          </div>
        </div>
        <h3 class="otp-merge-tip">合并到</h3>
        <div class="otp-group-to otp-group-layout">
          <div v-for="(item,index) in 50" class="otp-group-item">
            {{ index }}合并到
          </div>
        </div>
      </div>
      <el-button type="primary" style="margin-top: 30px;width:125px">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from '../../../libs/Storage';
import { isEmpty, parseXmlString, toast } from '../../../libs/util';
import EventBus from '../../../libs/EventBus';
import { collectImportApi } from '../../../api/OtherApi';

export default {
  name: 'MergeGroup',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.mergeGroupDialogVisible = v;
      }
    }
  },
  data () {
    return {
      radio: 2,
      fixedTab: 2,
      receiveTab: 2,
      mergeGroupDialogVisible: false
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
    mergeGroupOpenDeleteSite () {
      setStorage('delete_site', this.radio);
    },
    /**
     * 设置固定标签
     */
    mergeGroupOpenFixedTab () {
      setStorage('fixed_tab', this.fixedTab);
    },
    /**
     * 设置是否立即收起标签
     */
    mergeGroupReceiveTab () {
      setStorage('receive_tab', this.receiveTab);
    },
    closeDialog () {
      this.mergeGroupDialogVisible = false;
      this.$emit('close');
    }
  },
  mounted () {
    let ds = getStorage('delete_site') || 2;
    this.radio = +ds;
    let fixedTab = getStorage('fixed_tab') || 2;
    this.fixedTab = +fixedTab;
    let receiveTab = getStorage('receive_tab') || 2;
    this.receiveTab = +receiveTab;
  }
};
</script>

<style lang="less" scoped>

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, .3);
}

::-webkit-scrollbar-track {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, .1);
}

.otp-merge-group {

  .otp-merge-group-dialog {
    display: flex;

    .otp-merge-tip {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 80px;
      color: #0aafef;
    }

    .otp-group-layout {
      display: flex;
      flex-direction: column;
      height: 500px;
      border: 1px solid;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;

      .otp-group-item {
        flex: 1;
        height: 40px;
        border: 1px solid #c8c8c8;
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
      }
    }

    .otp-group-from {

    }

    .otp-group-from {

    }

    .otp-merge-group-dialog-item {
      margin-top: 10px;
    }
  }
}
</style>
