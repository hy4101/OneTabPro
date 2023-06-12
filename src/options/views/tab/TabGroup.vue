<template>
  <div class="otp-tab-group">
    <div class="otp-tab-group-header">
      <el-button size="mini" @click="onUpTab" type="primary">收起标签页</el-button>
      <el-button size="mini" @click="exportHtmlBtn" type="warning">导出</el-button>
    </div>
    <div class="otp-tab-group-list">
      <div class="otp-tab-item otp-collect" :class="['otp-tab-item']"
           v-if="collectTabs.tabs.length>0"
           @click="changeTabItem(collectTabs,-1)">
        <div style="font-weight: bold">
          我的收藏<span>({{ collectTabs.tabs.length }})</span>
        </div>
      </div>
      <div :class="['otp-tab-item']" v-for="(item,index) in tabGroups"
           :key="index"
           @click="changeTabItem(item,index)">
        <div :class="['otp-tab-item-line ',tabGroups.length-1!==index?'otp-tab-item-line-ac':'']">
          <span :class="[activeIndex===index?'otp-tab-item-dot-active':'']"></span>
        </div>
        <div
          :class="['otp-tab-item-info',placeIndex===index?'otp-tab-item-active-place':'',activeIndex===index?'otp-tab-item-active':'']"
          @drop="placeTab($event,item,index)" @dragover="onDragover($event,index)">
          <div class="otp-tab-item-info-input">
            <input v-model="item.name"
                   :style="{'width':item.name.length>0?(item.name.length*12+20)+'px':'90px'}"
                   placeholder="未命名标签组" @input="updateGroupName"/>
          </div>
          <div class="otp-group-footer">
            <div>
              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.tabs.length }}</i>
              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.createDate * 1000) }}</i>
            </div>
            <div class="otp-group-footer-images">
              <img v-for="(webItem,index) in item.tabs.filter(t=>t.favIconUrl!=null).slice(0,5).reverse()"
                   :style="{zIndex:index,right:(index*14+10)+'px'}"
                   :key="index" :src="webItem.favIconUrl">
            </div>
          </div>
          <!--          标签组排序DOM-->
          <div class="otp-tab-item-sotr">
            <div @click.stop="setGroupSort(index,0)" v-if="index>0">
              <sort></sort>
            </div>
            <div @click.stop="setGroupSort(index,1)" v-if="index<tabGroups.length-1">
              <sort style="transform: rotate(180deg)"></sort>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  CACHE_TABS_GROUP,
  COLLECT_TABS,
  getStorage,
  isAuthorization,
  removeItem,
  setStorage
} from '@/libs/Storage';
import {
  getCollectTabs,
  getTabsApi,
  modifyGroupName,
  saveTabGroupApi,
  saveTabsApi,
  setTabGroupSort
} from '../../../api/OtherApi';
import { dateFormatStr, getTabs, isEmpty, exportHtml } from '../../../libs/util.js';
import eventBus from '@/libs/EventBus';
import Sort from '../../components/icon/Sort.vue';

export default {
  name: 'TabGroup',
  components: { Sort },
  data () {
    return {
      lastTabId: -1,
      currentDragstartTab: null,
      placeIndex: null,
      activeIndex: 0,
      sendTab: null,
      tabGroups: [],
      collectTabs: { tabs: [] }
    };
  },
  methods: {
    /**
     * 排序事件
     * @param index
     * @param type
     */
    setGroupSort (index, type) {
      console.log(type);
      let tabGroups = [...this.tabGroups];
      let target = tabGroups[index];
      if (type === 0) {
        let temp = tabGroups[index - 1];
        tabGroups[index - 1] = target;
        tabGroups[index] = temp;
      }
      if (type === 1) {
        let temp = tabGroups[index + 1];
        tabGroups[index + 1] = target;
        tabGroups[index] = temp;
      }
      this.tabGroups = tabGroups;
      if (isAuthorization()) {
        setTabGroupSort(tabGroups.map(t => t.id));
      } else {
        setStorage(CACHE_TABS_GROUP, JSON.stringify(tabGroups));
      }
    },
    /**
     * 收起标签
     */
    onUpTab () {
      getTabs((res) => {
        this.filterUpTab(res);
      });
    },
    /**
     * 过滤收起的标签页
     * @param res
     */
    filterUpTab (res, groupName = '未命名标签组') {
      let sites = res.filter(s => !s.url.startsWith('chrome://newtab/') && !s.url.startsWith('chrome-extension://'));
      if (isEmpty(sites)) {
        return;
      }
      for (let site of sites) {
        site.path = site.url;
        site.tabGroupName = groupName;
      }
      let currentTime = new Date().getTime();
      this.tabGroupItem = {
        createDate: currentTime / 1000,
        tabGroup: currentTime,
        id: currentTime,
        lock: false,
        tabs: sites,
        name: groupName
      };
      this.saveTabs(this.tabGroupItem);
    },
    /**
     * 保存标签
     */
    saveTabs (groupItem) {
      this.tabGroups.splice(0, 0, groupItem);
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      this.changeTabItem(groupItem, 0);
      if (isAuthorization()) {
        saveTabGroupApi(groupItem.tabs).then((res) => {
          setStorage(CACHE_TABS_GROUP, JSON.stringify(res.data.data));
          this.tabGroups = res.data.data;
          this.changeTabItem(res.data.data[0], 0);
        });
      }
    },
    /**
     *
     * 导入onetab的数据
     * @param groups
     */
    importOneTabData (groups) {
      debugger;
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        this.filterUpTab(group, '来自：导入OneTab-' + (i + 1));
      }
      this.initTabs();
    },
    /**
     * 选择事件
     */
    changeTabItem (item, index) {
      this.activeIndex = index;
      this.$emit('change', item, index);
    },

    /**
     * 拖拽时进入可放置区域
     */
    placeTab (event, item, index) {
      event.preventDefault();
      if (index === this.activeIndex) {
        return;
      }
      let dragGroup = this.tabGroups[index];
      let newtab = Object.assign({}, this.currentDragstartTab);
      newtab.id = new Date().getTime();
      dragGroup.tabs.splice(0, 0, newtab);
      newtab.createDate = new Date().getTime();
      newtab.tabGroup = dragGroup.tabGroup;
      newtab.sort = 0;
      newtab.tabGroupId = dragGroup.id;
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      if (isAuthorization()) {
        saveTabsApi([newtab]).then((res) => {
          setStorage(CACHE_TABS_GROUP, JSON.stringify(res.data.data));
        });
      }
      eventBus.$emit('deleteDragstartTab');
      this.placeIndex = null;
    },
    onDragover ($event, index) {
      $event.preventDefault();
      this.placeIndex = index;
    },
    /**
     * 修改标签组名称
     * @param e
     */
    updateGroupName (e) {
      if (isAuthorization()) {
        let item = this.tabGroups[this.activeIndex];
        modifyGroupName(item.id, item.name);
      }
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
    },
    formatTime (v) {
      if (isEmpty(v)) {
        return null;
      }
      return dateFormatStr(new Date(v), 'yyyy-MM-dd');
    },
    /**
     * 初始化
     */
    initTabs (isChange = true) {
      if (isAuthorization()) {
        getTabsApi().then((res) => {
          let _res = res.data.data;
          this.saveSendTab(_res);
          if (isEmpty(_res)) {
            return;
          }
          setStorage(CACHE_TABS_GROUP, JSON.stringify(_res));
          this.setTabGroup(_res, isChange);
        });
        this.getCollectTabData();
      } else {
        let temp = getStorage(CACHE_TABS_GROUP);
        if (!isEmpty(temp)) {
          temp = JSON.parse(temp);
          this.setTabGroup(temp, isChange);
        }
        temp = getStorage(COLLECT_TABS);
        if (!isEmpty(temp)) {
          temp = JSON.parse(temp);
          this.collectTabs = { tabGroup: 'collect_id', tabs: temp };
        }
      }
    },

    /**
     * 如何登录的，则去保存发送的标签
     */
    saveSendTab (_res) {
      if (!isEmpty(this.sendTab)) {
        let newtab = Object.assign({}, this.sendTab);
        newtab.createDate = new Date().getTime();
        newtab.tabGroup = _res[0].tabGroup;
        saveTabsApi([newtab]).then((res) => {
          this.initTabs();
        });
        this.sendTab = null;
      }
    },
    /**
     * 监听是否有标签页发送
     */
    onSendTab (tab) {
      if (isAuthorization()) {
        this.sendTab = tab;
        this.initTabs();
        return;
      }
      let temp = getStorage(CACHE_TABS_GROUP);
      if (!isEmpty(temp)) {
        let site = tab;
        site.id = new Date().getTime();
        site.path = site.url;
        temp = JSON.parse(temp);
        temp[0].tabs = temp[0].tabs.filter(s => s.url !== tab.url);
        temp[0].tabs.splice(0, 0, site);
        setStorage(CACHE_TABS_GROUP, JSON.stringify(temp));
      } else {
        this.filterUpTab([tab]);
        eventBus.$emit('refresh');
      }
      this.initTabs();
    },
    /**
     * 获取收藏的数据
     */
    getCollectTabData () {
      getCollectTabs().then(res => {
        let _res = res.data.data;
        if (isEmpty(_res)) {
          removeItem(COLLECT_TABS);
          return;
        }
        setStorage(COLLECT_TABS, JSON.stringify(_res));
        this.collectTabs = { tabGroup: 'collect_id', val: _res };
      });
    },
    /**
     * 设置标签组的值
     * @param _res
     * @param isChange
     */
    setTabGroup (_res, isChange) {
      let collectTabs = getStorage('collect_tabs');
      if (!isEmpty(collectTabs)) {
        this.collectTabs = { tabGroup: 'collect_id', val: JSON.parse(collectTabs) };
      }
      for (let re of _res) {
        if (isEmpty(re.name)) {
          re.name = '未命名标签组';
        }
      }
      this.tabGroups = _res;
      if (isChange) {
        this.changeTabItem(this.tabGroups[0], 0);
      }
    },

    onFilter (v) {
      if (isEmpty(v)) {
        this.changeTabItem(this.tabGroups[0], 0);
        return;
      }
      let tgs = [];
      for (let tabGroup of this.tabGroups) {
        for (let valElement of tabGroup.tabs) {
          if (isEmpty(valElement.title)) {
            continue;
          }
          if (valElement.title.toLowerCase().indexOf(v.toLowerCase()) >= 0) {
            valElement.groupName = tabGroup.name;
            tgs.push(valElement);
          }
        }
      }
      this.changeTabItem({ tabs: tgs, time: null }, -1);
    },
    exportHtmlBtn () {
      let tabGroups = [...this.tabGroups];
      let collectTabs = getStorage('collect_tabs');
      if (!isEmpty(collectTabs)) {
        collectTabs = { tabGroup: 'collect_id', name: '我的收藏', time: '', val: JSON.parse(collectTabs) };
        tabGroups.splice(0, 0, collectTabs);
      }
      exportHtml(tabGroups);
    },
    createGroup () {
      let createTime = new Date().getTime();
      this.tabGroups.splice(0, 0, {
        tabGroup: createTime,
        name: '未命名标签组',
        tabs: [],
        id: createTime,
        createDate: createTime / 1000
      });
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      this.changeTabItem(this.tabGroups[0], 0);
    }
  },
  mounted () {
    this.initTabs();
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'send_tab' && !isEmpty(message.tab)) {
        this.onSendTab(message.tab);
      }
      if (message.type === 'receive_tab') {
        let receive = getStorage(message.type);
        if (!isEmpty(receive) && +receive === 1) {
          this.onUpTab();
        }
      }
      if (message.type === 'one_tab_pro_send_right_or_left') {
        this.filterUpTab(message.tabs, message.groupName);
        let ids = message.tabs.map(t => t.id);
        chrome.tabs.remove(ids, () => {
          console.log('成功');
        });
      }
    });
    eventBus.$on('updateTabItem', (item) => {
      if (item.tabGroup === 'collect_id') {
        if (item.tabs.length <= 0) {
          removeItem('collect_tabs');
        } else {
          setStorage('collect_tabs', JSON.stringify(item.tabs));
        }
      } else {
        if (isEmpty(item.tabs)) {
          this.tabGroups.splice(this.activeIndex, 1);
        } else {
          this.tabGroups.splice(this.activeIndex, 1, item);
        }
        if (isEmpty(this.tabGroups)) {
          removeItem(CACHE_TABS_GROUP);
          eventBus.$emit('refresh');
          return;
        }
        setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      }
    });
    eventBus.$on('deleteGroup', () => {
      this.tabGroups.splice(this.activeIndex, 1);
      if (isEmpty(this.tabGroups)) {
        removeItem(CACHE_TABS_GROUP);
        eventBus.$emit('refresh');
      } else {
        setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
        this.changeTabItem(this.tabGroups[0], 0);
      }
    });
    eventBus.$on('filter', this.onFilter);
    eventBus.$on('init_tab_data', this.initTabs);
    eventBus.$on('onUpTab', this.onUpTab);
    eventBus.$on('saveTabs', this.saveTabs);
    eventBus.$on('importOneTabData', this.importOneTabData);
    eventBus.$on('dragstartTab', (tab) => {
      this.currentDragstartTab = tab;
    });
    eventBus.$on('tab_drop', (tab) => {
      this.placeIndex = null;
    });
    eventBus.$on('createGroup', this.createGroup);
    eventBus.$on('initCollectTabData', this.getCollectTabData);
  }
};
</script>

<style lang="less" scoped>

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, .3);
}

::-webkit-scrollbar-track {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, .1);
}

.otp-tab-group {
  display: flex;
  height: 90vh;
  flex-direction: column;
  padding-top: 12px;
  min-width: 300px;
  max-width: 350px;

  .otp-tab-group-header {
    border-bottom: 2px solid #efefef;
    margin-bottom: 12px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      margin-left: 6px;
    }
  }

  .otp-tab-group-list {
    display: flex;
    height: 100%;
    flex-direction: column;
    max-width: 350px;
    overflow-y: auto;
    //padding-left: 24px;
    //margin-right: 12px;

    .otp-tab-item-info:hover:not(:first-child) {
      background: #1296db;

      input, div {
        color: #fff;
      }
    }

    .otp-tab-item-info:hover .otp-tab-item-sotr {
      display: flex;
    }

    .otp-tab-item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 0 20px;

      .otp-tab-item-sotr {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
      }

      .otp-tab-item-info {
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        align-items: self-start;
        //padding-top: 2px;
        flex: 12;
        //margin-bottom: 10px;
        overflow: hidden;
        //padding-left: 4px;
        position: relative;
        background: #efefef;
        //border: 1px solid #efefef;
        border-radius: 6px;
        padding: 0 10px 10px 10px;
        margin-bottom: 10px;

        .otp-group-footer {
          display: flex;
          width: 100%;

          .otp-group-footer-images {
            flex: 1;
            display: flex;
            justify-content: flex-end;

            img {
              margin-right: 4px;
              position: absolute;
              width: 18px;
              height: 18px;
              border-radius: 18px;
            }
          }
        }

        .otp-tab-item-info-input {
          height: 38px;
          display: flex;
          align-items: center;

          > input {
            border: none;
            outline: none;
            background: #ff000000;
          }

          > div {
            font-size: 12px;
            color: #8d8989;
            width: 35px;
            text-align: right;
          }
        }

        .otp-tab-item-tag {
          height: 10px;
          background-color: #ecf5ff;
          border-radius: 4px;
          padding: 2px;
          font-size: 12px;
          color: #409eff;
          margin-top: 6px;
        }

        .otp-tab-group-drag-voer {
          background: #0bbd87;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        span {
          font-weight: bold;
        }
      }

      .otp-tab-item-active-place {
        background: #C8C8C8FF;
        border-radius: 8px;
        border: 1px dashed rgba(0, 0, 0, 0.55);
      }
    }

    .otp-collect {
      padding: 10px 0;
      border: 1px solid #c8c8c8;
      border-radius: 10px;
      justify-content: center;
      width: 80%;
      margin: 5px auto;
    }

    //
    //.otp-create-group {
    //  margin-bottom: 16px;
    //  padding: 10px 0;
    //  border: 1px dashed #c8c8c8;
    //  border-radius: 10px;
    //  justify-content: center;
    //}

    .otp-tab-item-active {
      color: #fff;
      background: #1296db !important;

      i {
        color: #e3e3e3 !important;
      }

      input {
        color: #fff;
      }
    }

    .otp-tab-item-dot-active {
      background: #66b1ff !important;
    }
  }
}
</style>
