<template>
  <!--  精选网站-->
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
            <div class="otp-group-name">
              <input v-model="tabGroupItem.tabGroupName" maxlength="20" @blur="endInputName"
                     placeholder="请修改标签组名称 / 20字"/>
            </div>
          </template>
        </div>
        <div style="overflow-y: auto; width: 100%;height: 100%;margin-top: 48px;padding-bottom: 100px;">
          <template v-if="tabGroupItem.val!==null&&tabGroupItem.val.length>0">
            <div class="ftb-tabs-item" v-for="(site,index) in tabGroupItem.val" :key="site.id">
              <div style="position: relative">
                <i class="el-icon-delete" style="color:black;margin-right: 6px;cursor: pointer"
                   v-if="activeGroupIndex>=0"
                   @click="deleteItem(site,index)"></i>
                <img class="fsb-sl-image" v-if="site.favIconUrl!=null"
                     :src="site.favIconUrl">
                <i v-else class="el-icon-link  fsb-sl-image" style="color:black;margin-right: 6px"></i>
                <a :href="site.path" target="_blank" class="fsb-sl-info">
                  {{ site.title }}
                </a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { isAuthorization } from '../../../libs/Storage';
import { isEmpty, toast } from '../../../libs/util';
import { deleteApi, deleteTabGroupApi, lockTab, modifyGroupName } from '../../../api/OtherApi.js';
import EventBus from '@/libs/EventBus';

export default {
  name: 'tabs',
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
      tabGroupItem: { time: null, val: [] }
    };
  },
  watch: {
    tabGroup (v) {
      this.tabGroupItem = v;
    }
  },
  methods: {

    /**
     * 删除单个数据
     * @param item
     * @param index
     */
    deleteItem (item, index) {
      this.tabGroupItem.val.splice(index, 1);
      EventBus.$emit('updateTabItem', this.tabGroupItem);
      toast('删除成功');
      if (isAuthorization()) {
        deleteApi(item.id);
      }
    },

    /**
     * 结束输入名称
     * @param v
     */
    endInputName (v) {
      if (isEmpty(this.tabGroupItem.tabGroupName)) {
        return;
      }
      EventBus.$emit('updateTabItem', this.tabGroupItem);
      if (isAuthorization()) {
        modifyGroupName(this.tabGroupItem.tabGroup, this.tabGroupItem.tabGroupName);
      }
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
    },

    deleteTabGroup () {
      EventBus.$emit('deleteGroup');
      if (isAuthorization()) {
        deleteTabGroupApi(this.tabGroupItem.tabGroup);
      }
      toast('标签组已删除');
    }
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
