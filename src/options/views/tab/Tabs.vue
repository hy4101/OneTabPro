<template>
  <!--  标签页列表 -->
  <div class="free-tabs">
    <div class="ft-body">
      <div class="ftb-tabs-list">
        <div class="fbb-toolbar">
          <template v-if="activeGroupIndex<0">
            <div style="margin-left: 10px">
              搜索结果： 包含{{ tabGroupItem.val.length }}个标签页
            </div>
          </template>
          <template v-else>
            <div style="display: flex;">
              <el-tooltip effect="dark" content="创建分组" placement="top-start">
                <i class="el-icon-circle-plus obp-opts-icon" @click="toolbarBtn(20)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="设置" placement="top-start">
                <i class="el-icon-s-tools obp-opts-icon" @click="toolbarBtn(10)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="打开所有" placement="top-start">
                <i class="el-icon-link obp-opts-icon" @click="toolbarBtn(0)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除标签组" placement="top-start">
                <i class="el-icon-delete obp-opts-icon" @click="toolbarBtn(1)"
                   style=""></i>
              </el-tooltip>
            </div>
            <div style="margin-left: 10px">
              创建于： {{ tabGroupItem.time }}，包含{{ tabGroupItem.val.length }}个标签页
            </div>
          </template>
        </div>
        <div style="overflow-y: auto; width: 100%;height: 100%;margin-top: 48px;padding-bottom: 100px;">
          <template v-if="tabGroupItem.val!==null&&tabGroupItem.val.length>0">
            <div class="ftb-tabs-item" v-for="(site,index) in tabGroupItem.val" :key="site.id">
              <div v-if="site.dragStatus" class="active-item-drop"></div>
              <div v-else style="position: relative"
                   @drop="placeTab($event,site,index)" @dragover="onDragover($event,index)">
                <i class="el-icon-delete" style="color:black;margin-right: 6px;cursor: pointer"
                   v-if="activeGroupIndex>=-1"
                   @click="deleteItem(site,index)"></i>
                <i @click="iconBtn(site)" v-if="tabGroup.tabGroup!=='collect_id'" style="cursor: pointer">
                  <collect></collect>
                </i>
                <div class="ftb-tabs-item-info" @dragend="dragendTab" @dragover="e=>e.preventDefault()"
                     @dragstart="dragstartTab($event,site,index)" draggable="true">
                  <img class="fsb-sl-image" v-if="site.favIconUrl!=null"
                       :src="site.favIconUrl">
                  <i v-else class="el-icon-link  fsb-sl-image"
                     style="color:black;margin-right: 6px;font-size: 16px"></i>
                  <div @click="onSite(site,index)" class="fsb-sl-info">
                    {{ site.title }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <setting-dialog :show="isShowSettingDialog" @close="onClose"></setting-dialog>
  </div>
</template>

<script>

import { CACHE_TABS_GROUP, getStorage, isAuthorization, setStorage } from '../../../libs/Storage';
import { isEmpty, openSite, toast } from '../../../libs/util';
import { collectApi, deleteApi, deleteTabGroupApi, lockTab, saveTabsApi } from '../../../api/OtherApi.js';
import EventBus from '@/libs/EventBus';
import Collect from '../../components/icon/Collect.vue';
import SettingDialog from './SettingDialog.vue';
import eventBus from '../../../libs/EventBus';

export default {
  name: 'tabs',
  components: {
    Collect,
    SettingDialog
  },
  props: {
    activeGroupIndex: {
      type: Number,
      default: 0
    },
    tabGroup: {
      type: Object,
      deep: true,
      immediate: true,
      default () {
        return { time: null, val: [] };
      }
    }
  },
  data () {
    return {
      placeItemIndex: null,
      currentDratIndex: null,
      currentDratItem: null,
      isShowSettingDialog: false,
      tabGroupItem: { time: null, val: [] }
    };
  },
  watch: {
    tabGroup (v) {
      if (!isEmpty(v.val)) {
        v.val.sort((a, b) => {
          return a.createDate > b.createDate ? -1 : 1;
        });
      }
      this.tabGroupItem = v;
    }
  },
  methods: {
    onDragover ($event, index) {
      console.log('进入');
      $event.preventDefault();
      this.placeItemIndex = index;
      let temp = this.tabGroupItem.val;
      temp = temp.filter((t) => isEmpty(t.dragStatus));
      temp.splice(index, 0, { dragStatus: true });
      this.tabGroupItem.val = temp;
    },
    /**
     * 拖拽时进入可放置区域
     */
    placeTab (event, item, index) {
      event.preventDefault();
    },
    /**
     * 删除单个数据
     * @param item
     * @param index
     * @param message
     */
    deleteItem (item, index, message = '删除成功') {
      this.tabGroupItem.val.splice(index, 1);
      EventBus.$emit('updateTabItem', this.tabGroupItem);
      toast(message);
      if (isAuthorization()) {
        deleteApi(item.id);
      }
    },
    onSite (item, index) {
      let ds = getStorage('delete_site') || 2;
      if (1 === +ds) {
        this.deleteItem(item, index);
      }
      openSite(item.path);
    },
    /**
     * 收藏标签
     */
    iconBtn (item) {
      collectApi(item);
    },
    dragendTab () {
      EventBus.$emit('tab_drop');
      setTimeout(() => {
        EventBus.$emit('dragstartTab', null);
      }, 100);
    },
    /**
     * 开始拖拽
     */
    dragstartTab (e, site, index) {
      this.currentDratIndex = index;
      this.currentDratItem = site;
      EventBus.$emit('dragstartTab', site);
    },
    /**
     * type = 0 打开所有
     * type = 1 删除
     * @param type
     */
    toolbarBtn (type) {
      if (0 === type) {
        this.tabGroupItem.val.forEach(item => {
          window.open(item.url, '_blank');
        });
      }
      if (1 === type) {
        this.$confirm('是否删除当前标签组？', '确认信息', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          callback: (res) => {
            if ('confirm' === res) {
              this.deleteTabGroup();
            }
          }
        });
      }
      if (2 === type) {
        this.$emit('upTab');
      }
      if (3 === type) {
        this.tabGroupItem.lock = !this.tabGroupItem.lock;
        EventBus.$emit('updateTabItem', this.tabGroupItem);
        lockTab(this.tabGroupItem.tabGroup, this.tabGroupItem.lock);
      }
      if (10 === type) {
        this.isShowSettingDialog = true;
      }
      if (20 === type) {
        EventBus.$emit('createGroup');
      }
    },
    onClose () {
      this.isShowSettingDialog = false;
    },
    deleteTabGroup () {
      EventBus.$emit('deleteGroup');
      if (isAuthorization()) {
        deleteTabGroupApi(this.tabGroupItem.tabGroup);
      }
      toast('标签组已删除');
    },
    /**
     * 拖拽成功后，删除被拖拽的数据
     */
    deleteDragstartTab () {
      this.deleteItem(this.currentDratItem, this.currentDratIndex, '移动成功');
    }
  },
  mounted () {
    EventBus.$on('deleteDragstartTab', this.deleteDragstartTab);
  }
};
</script>

<style scoped lang="less">

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

.free-tabs {
  width: 100vw;
  height: 100vh;

  .ft-body {
    display: flex;
    width: 100%;
    height: 100%;
    margin-top: 8px;

    .ftb-tabs-list {
      display: flex;
      flex: 1;
      color: #606266;
      background: #efefef;
      padding: 4px 4px 4px 20px;
      flex-direction: column;
      align-items: flex-start;
      position: relative;

      .fbb-toolbar {
        position: absolute;
        top: -8px;
        left: 0;
        height: 50px;
        display: flex;
        align-items: center;
        background: #FFFFFF;
        border-bottom: 1px solid #00000021;
        width: 100%;

        .otp-group-name {
          width: 268px;
          height: 30px;
          border-bottom: 1px solid #dcdfe6;
          padding: 0 10px;
          margin-left: 10px;

          > input {
            border: 0;
            outline: none;
            height: 90%;
            width: 100%;
            font-weight: bold;
            color: #3c3c3c;
          }
        }

        .obp-opts-icon {
          margin-left: 6px;
          margin-right: 10px;
          cursor: pointer;
          font-size: 20px;
        }

      }

      .ftb-tabs-item {
        width: 100%;
        display: flex;
        margin-top: 4px;

        .ftb-tabs-item-info {
          display: flex;
        }

        .active-item-drop {
          border: 1px dashed #c8c8c8;
          height: 24px;
          width: 165px;
        }
      }

      .ftb-tabs-item:hover .ios-trash {
        display: block;
      }

      .ftb-tabs-item > div {
        display: flex;
        color: #0C81DE;
        align-items: center;
        margin-top: 4px;
      }

      .fsb-sl-image {
        width: 16px;
        height: 16px;
        border-radius: 2px;
        margin-left: 16px;
      }

      .fsb-sl-info {
        margin-left: 10px;
        height: 100%;
        position: relative;
        flex: 1;
        cursor: pointer;
        text-align: left;
      }
    }
  }
}

</style>
