<template>
  <div class="otp-tab-group">
    <div class="otp-tab-group-header">
      <el-button size="mini" @click="onUpTab" type="primary">收起标签页</el-button>
      <el-button size="mini" @click="exportHtmlBtn" type="warning">导出</el-button>
    </div>
    <div class="otp-tab-group-list">
      <div class="otp-tab-item otp-collect" :class="['otp-tab-item',activeIndex===-1?'otp-tab-item-active':'']"
           v-if="collectTabs.val.length>0"
           @click="changeTabItem(collectTabs,-1)">
        <div style="font-weight: bold">
          我的收藏
        </div>
        <div style="font-size: 12px;margin-left: 10px">
          {{ collectTabs.val.length }}个标签页
        </div>
      </div>
      <div :class="['otp-tab-item',activeIndex===index?'otp-tab-item-active':'']" v-for="(item,index) in tabGroups"
           :key="index" @click="changeTabItem(item,index)">
        <div :class="['otp-tab-item-line ',tabGroups.length-1!==index?'otp-tab-item-line-ac':'']">
          <span :class="[activeIndex===index?'otp-tab-item-dot-active':'']"></span>
        </div>
        <div class="otp-tab-item-info">
          <div>
            <span v-if="item.tabGroupName">{{ item.tabGroupName }}</span>
            <span v-else>未命名标签组</span>
          </div>
          <div class="otp-tab-item-tag" v-if="item.lock">已锁定</div>
          <p>
            {{ item.val.length }}个标签页 {{ item.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { CACHE_TABS_GROUP, COLLECT_TABS, getStorage, isAuthorization, removeItem, setStorage } from '@/libs/Storage';
import { getCollectTabs, getTabsApi, saveTabsApi } from '../../../api/OtherApi';
import { dateFormatStr, getTabs, isEmpty, exportHtml } from '../../../libs/util.js';
import eventBus from '@/libs/EventBus';

export default {
  name: 'TabGroup',
  data () {
    return {
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
        this.tabGroupItem = { time: time, tabGroup: new Date().getTime(), lock: false, val: sites };
        this.saveTabs(this.tabGroupItem);
      });
    },
    /**
     * 保存标签
     */
    saveTabs (tabItem) {
      this.tabGroups.splice(0, 0, tabItem);
      setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroups));
      this.changeTabItem(tabItem, 0);
      if (isAuthorization()) {
        saveTabsApi(tabItem.val).then((res) => {
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
        getCollectTabs().then(res => {
          let _res = res.data.data;
          if (isEmpty(_res)) {
            return;
          }
          setStorage(COLLECT_TABS, JSON.stringify(_res));
          this.collectTabs = { tabGroup: 'collect_id', val: _res };
        });
      } else {
        let temp = getStorage(CACHE_TABS_GROUP);
        if (!isEmpty(temp)) {
          temp = JSON.parse(temp);
          this.setTabGroup(temp, isChange);
        }
      }
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
    padding-left: 24px;
    margin-right: 12px;

    .otp-tab-item {
      display: flex;
      cursor: pointer;

      .otp-tab-item-line {
        position: relative;
        width: 20px;
        flex: 1;

        span {
          position: absolute;
          top: 0;
          left: -11px;
          width: 20px;
          height: 20px;
          background: #E4E7ED;
          border-radius: 20px;
        }
      }

      .otp-tab-item-line-ac {
        border-left: 2px solid #E4E7ED;
      }

      .otp-tab-item-info {
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        align-items: self-start;
        padding-top: 2px;
        flex: 12;
        margin-bottom: 10px;

        .otp-tab-item-tag {
          height: 10px;
          background-color: #ecf5ff;
          border-radius: 4px;
          padding: 2px;
          font-size: 12px;
          color: #409eff;
          margin-top: 6px;
        }

        span {
          font-weight: bold;
        }
      }
    }

    .otp-collect {
      margin-bottom: 16px;
    }

    .otp-tab-item-active {
      color: #66b1ff;
    }

    .otp-tab-item-dot-active {
      background: #66b1ff !important;
    }
  }
}
</style>
