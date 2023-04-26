<template>
  <!--  标签页列表 -->
  <div class="free-tabs">
    <div class="ft-body">
      <div class="ftb-tabs-list">
        <div class="fbb-toolbar">
          <template v-if="activeGroupIndex<0">
            <div style="margin-left: 10px;user-select: none">
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
              <el-tooltip effect="dark" content="名称排序" placement="top-start">
                <i class="ftb-tab-com" @click="toolbarBtn(30)">
                  <name-sort-icon :color="nameSortColor"></name-sort-icon>
                </i>
              </el-tooltip>
              <el-tooltip effect="dark" content="域名排序" placement="top-start">
                <i class="ftb-tab-com" @click="toolbarBtn(40)">
                  <url-sort-icon :color="urlSortColor"></url-sort-icon>
                </i>
              </el-tooltip>
            </div>
            <div style="margin-left: 10px;user-select: none">
              创建于： {{ tabGroupItem.time }}，包含{{ tabGroupItem.val.length }}个标签页
            </div>
          </template>
        </div>
        <div style="overflow-y: auto; width: 100%;height: 100%;margin-top: 48px;padding-bottom: 100px;">
          <template v-if="tabGroupItem.val!==null&&tabGroupItem.val.length>0">
            <div class="ftb-tabs-item" v-for="(site,index) in tabGroupItem.val" :key="site.id">
              <div v-if="site.dragStatus" @dragover="e=>e.preventDefault()"
                   @drop="changeTabSort($event,site,index)" draggable="true"
                   class="active-item-drop"></div>
              <div v-else style="position: relative">
                <i class="el-icon-delete" style="color:black;margin-right: 6px;cursor: pointer"
                   v-if="activeGroupIndex>=-1" @click="deleteItem(site,index)"></i>
                <i @click="iconBtn(site)" v-if="tabGroup.tabGroup!=='collect_id'" style="cursor: pointer">
                  <collect></collect>
                </i>
                <div class="ftb-tabs-item-info" @dragend="dragendTab"
                     @dragover="onDragover($event,index)"
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

import { getStorage, isAuthorization } from '../../../libs/Storage';
import { isEmpty, openSite, toast } from '../../../libs/util';
import { collectApi, deleteApi, deleteTabGroupApi, lockTab, setTabSort } from '../../../api/OtherApi.js';
import EventBus from '@/libs/EventBus';
import Collect from '../../components/icon/Collect.vue';
import NameSortIcon from '../../components/icon/NameSortIcon.vue';
import UrlSortIcon from '../../components/icon/UrlSortIcon.vue';
import SettingDialog from './SettingDialog.vue';

export default {
  name: 'tabs',
  components: {
    Collect,
    NameSortIcon,
    UrlSortIcon,
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
      nameSortColor: '#657174',
      urlSortColor: '#657174',
      placeItemIndex: null,
      currentDratIndex: null,
      currentDratItem: null,
      isShowSettingDialog: false,
      tabGroupItem: { time: null, val: [] },
      tempTabs: null
    };
  },
  watch: {
    tabGroup (v) {
      if (!isEmpty(v.val)) {
        // v.val.sort((a, b) => {
        //   return a.createDate > b.createDate ? -1 : 1;
        // });
      }
      this.tabGroupItem = v;
      this.tempTabs = Object.assign({}, v);
    }
  },
  methods: {
    /**
     * 放到何处
     * @param $event
     * @param index
     */
    onDragover ($event, index) {
      console.log('进入的下标:', index);
      this.placeItemIndex = index;
      $event.preventDefault();
      let temp = this.tabGroupItem.val;
      temp = temp.filter((t) => isEmpty(t.dragStatus));
      temp.splice(index, 0, { dragStatus: true });
      this.tabGroupItem.val = temp;
    },
    /**
     * 拖拽时进入可放置区域
     * currentDratItem
     */
    changeTabSort (event, item, index) {
      event.preventDefault();
      let val = this.tabGroupItem.val.filter(t => t.id !== this.currentDratItem.id);
      val.splice(this.placeItemIndex, 0, this.currentDratItem);
      this.tabGroupItem.val = val.filter((t) => isEmpty(t.dragStatus));
      EventBus.$emit('updateTabItem', this.tabGroupItem);
      if (isAuthorization()) {
        setTabSort(this.tabGroupItem.val);
      }
    },
    /**
     * 删除单个数据
     * @param item
     * @param index
     * @param message
     */
    deleteItem (item, index, message = '删除成功') {
      this.tabGroupItem.val = this.tabGroupItem.val.filter((t) => isEmpty(t.dragStatus));
      this.tabGroupItem.val.splice(index, 1);
      this.tempTabs.val = this.tempTabs.val.filter(t => t.id !== item.id);
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
      if (30 === type) {
        this.nameSortColor = this.nameSortColor === '#657174' ? '#409EFF' : '#657174';
        let tempTabs = [...this.tempTabs.val];
        this.sortTab(tempTabs, this.nameSortColor, this.urlSortColor);
      }
      if (40 === type) {
        this.urlSortColor = this.urlSortColor === '#657174' ? '#409EFF' : '#657174';
        let tempTabs = [...this.tempTabs.val];
        this.sortTab(tempTabs, this.nameSortColor, this.urlSortColor);
      }
    },
    /**
     * 排序
     */
    sortTab (tempTabs, nameColor, urlColor) {
      if ('#409EFF' === nameColor) {
        tempTabs.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          } else if (a.title > b.title) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      if ('#409EFF' === urlColor) {
        tempTabs.sort((a, b) => {
          if (a.path < b.path) {
            return 1;
          } else if (a.path > b.path) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      this.tabGroupItem.val = tempTabs;
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

        .ftb-tab-com {
          cursor: pointer;
          padding: 0 6px;
        }

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
