<template>
  <div class="one-tab-pro">
    <template v-if="isTabs">
      <tab-group @change="onChange"></tab-group>
      <tabs class="otp-tabs" :tab-group="tab" :active-group-index="activeGroupIndex"></tabs>
    </template>
    <div v-else class="one-tab-pro-null">
      <h3>OneTab Pro更实用的新一代标签页管理工具</h3>
      <h4>更友好的管理界面</h4>
      <h4>更友好的使用体验</h4>
      <h4>支持数据云同步</h4>
      <a href="https://www.ixigua.com/7203374536908079628?is_new_connect=0&is_new_user=0" target="_blank">如何使用？</a>
      <i class="el-icon-reading"></i>
      <div style="height: 150px;display: flex;align-items: flex-end">
        <el-button @click="onUpTab" type="primary">收起标签页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import TabGroup from './TabGroup.vue';
import Tabs from './Tabs.vue';
import { isEmpty, toast } from '@/libs/util';
import {
  CACHE_TABS_GROUP,
  getStorage
} from '@/libs/Storage';
import EventBus from '@/libs/EventBus';

export default {
  components: {
    TabGroup, Tabs
  },
  name: 'Index',
  data () {
    return {
      isTabs: true,
      activeGroupIndex: 0,
      tab: {
        time: null, val: [{ favIconUrl: null, path: null, title: null }]
      }
    };
  },
  mounted () {
    this.isTabs = !isEmpty(getStorage(CACHE_TABS_GROUP));
    EventBus.$on('refresh', () => {
      this.isTabs = !isEmpty(getStorage(CACHE_TABS_GROUP));
      this.init(true);
    });
  },
  methods: {
    onUpTab () {
      chrome.tabs.query({}, (res) => {
        console.log(res);
        if (isEmpty(res) || res.length <= 1) {
          toast('暂无标签页可收起');
          return;
        }
        EventBus.$emit('onUpTab');
        setTimeout(() => {
          this.isTabs = true;
        }, 800);
      });
    },
    onChange (item, index) {
      this.tab = item;
      this.activeGroupIndex = index;
    },

    init (isRefresh) {
      setTimeout(() => {
        EventBus.$emit('init_tab_data');
      }, 1200);
    }
  }
};
</script>

<style lang="less" scoped>
.one-tab-pro {
  display: flex;

  .otp-tabs {
    flex: 1;
  }

  .one-tab-pro-null {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 94vh;
    flex-direction: column;

    span {
      color: #1296db;
      cursor: pointer;
    }

    a {
      color: #1296db;
      margin-top: 10px;
    }

    h3 {
      font-size: 32px;
    }

    i > {
      font-size: 120px;
    }
  }
}

</style>
