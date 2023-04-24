<template>
  <div class="otp-tab-group">
    <div class="otp-tab-group-header">
      <el-button size="mini" @click="onUpTab" type="primary">收起标签页</el-button>
      <el-button size="mini" @click="exportHtmlBtn" type="warning">导出</el-button>
    </div>
    <div class="otp-tab-group-list">
      <div class="otp-tab-item otp-collect" :class="['otp-tab-item']"
           v-if="collectTabs.val.length>0"
           @click="changeTabItem(collectTabs,-1)">
        <div style="font-weight: bold">
          我的收藏<span>({{ collectTabs.val.length }})</span>
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
            <input v-model="item.tabGroupName"
                   :style="{'width':item.tabGroupName.length>0?(item.tabGroupName.length*12+10)+'px':'90px'}"
                   placeholder="未命名标签组" @input="updateGroupName"/>
          </div>
          <div class="otp-group-footer">
            <div style="flex: 1">
              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.val.length }}</i>
              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.time) }}</i>
            </div>
            <div class="otp-group-footer-images">
              <img v-for="(webItem,index) in item.val.slice(0,5).reverse()"
                   :style="{zIndex:index,right:(index*14+10)+'px'}"
                   :key="index" :src="webItem.favIconUrl">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { CACHE_TABS_GROUP, COLLECT_TABS, getStorage, isAuthorization, removeItem, setStorage } from '@/libs/Storage';
import { getCollectTabs, getTabsApi, modifyGroupName, saveTabsApi } from '../../../api/OtherApi';
import { dateFormatStr, getTabs, isEmpty, exportHtml } from '../../../libs/util.js';
import eventBus from '@/libs/EventBus';

export default {
  name: 'TabGroup',
  data () {
    return {
      currentDragstartTab: null,
      placeIndex: null,
      activeIndex: 0,
      tabGroups: [],
      collectTabs: { val: [] }
    };
  },
  methods: {
    /**
     * 收起标签
     */
    onUpTab () {
      getTabs((res) => {
        let time = dateFormatStr();
        let sites = res.filter(s => !s.url.startsWith('chrome://newtab/') && !s.url.startsWith('chrome-extension://'));
        if (isEmpty(sites)) {
          return;
        }
        for (let site of sites) {
          site.path = site.url;
        }
        this.tabGroupItem = {
          time: time,
          tabGroup: new Date().getTime(),
          lock: false,
          val: sites,
          tabGroupName: '未命名标签组'
        };
        this.saveTabs(this.tabGroupItem);
      });
    },
    /**
     * 保存标签
     */
    saveTabs (groupItem) {
      this.tabGroups.splice(0, 0, groupItem);
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      this.changeTabItem(groupItem, 0);
      if (isAuthorization()) {
        saveTabsApi(groupItem.val).then((res) => {
          setStorage(CACHE_TABS_GROUP, JSON.stringify(res.data.data));
        });
      }
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
      dragGroup.val.splice(0, 0, newtab);
      newtab.createDate = new Date().getTime();
      newtab.tabGroup = dragGroup.tabGroup;
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
        modifyGroupName(item.tabGroup, item.tabGroupName);
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
          this.collectTabs = { tabGroup: 'collect_id', val: temp };
        }
      }
    },
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
        if (isEmpty(re.tabGroupName)) {
          re.tabGroupName = '未命名标签组';
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
        for (let valElement of tabGroup.val) {
          if (isEmpty(valElement.title)) {
            continue;
          }
          if (valElement.title.toLowerCase().indexOf(v.toLowerCase()) >= 0) {
            tgs.push(valElement);
          }
        }
      }
      this.changeTabItem({ val: tgs, time: null }, -1);
    },
    exportHtmlBtn () {
      let tabGroups = [...this.tabGroups];
      let collectTabs = getStorage('collect_tabs');
      if (!isEmpty(collectTabs)) {
        collectTabs = { tabGroup: 'collect_id', tabGroupName: '我的收藏', time: '', val: JSON.parse(collectTabs) };
        tabGroups.splice(0, 0, collectTabs);
      }
      exportHtml(tabGroups);
    },
    createGroup () {
      let createTime = new Date();
      this.tabGroups.splice(0, 0, {
        tabGroup: createTime.getTime(),
        tabGroupName: '未命名标签组',
        time: dateFormatStr(createTime),
        val: []
      });
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
    }
  },
  mounted () {
    this.initTabs();
    eventBus.$on('updateTabItem', (item) => {
      if (item.tabGroup === 'collect_id') {
        if (item.val.length <= 0) {
          removeItem('collect_tabs');
        } else {
          setStorage('collect_tabs', JSON.stringify(item.val));
        }
      } else {
        if (isEmpty(item.val)) {
          this.tabGroups.splice(this.activeIndex, 1);
        } else {
          this.tabGroups.splice(this.activeIndex, 1, item);
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

    .otp-tab-item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 0 20px;

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
