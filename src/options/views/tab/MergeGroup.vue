<template>
  <div class="otp-merge-group">
    <el-dialog title="合并分组" :visible.sync="mergeGroupDialogVisible" width="50%"
               :before-close="closeDialog">
      <div class="otp-merge-group-dialog">

        <div class="otp-group-from otp-group-layout">
          <div v-for="(item,index) in tabGroup" @click="selectTabGroup(0,index)" :key="item.id"
               :class="['otp-group-item',index===leftIndex?'active-item':'']">
            <div>
              {{ item.name }}
            </div>
            <div>
              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.tabs.length }}</i>
              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.createDate * 1000) }}</i>
            </div>
          </div>
        </div>
        <h3 class="otp-merge-tip">
          <!--          <i class="el-icon-sort-up" style="margin-right: 10px;color:#939cac"></i>-->
          <!--          <i class="el-icon-sort-up" style="margin-right: 10px;color:#939cac"></i>-->
          合并到
        </h3>

        <div class="otp-group-to otp-group-layout">
          <div v-for="(item,index) in tabGroup" @click="selectTabGroup(1,index)" :key="item.id"
               :class="['otp-group-item',index===rightIndex?'active-item':'']">
            <div>
              {{ item.name }}
            </div>
            <div>
              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.tabs.length }}</i>
              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.createDate * 1000) }}</i>
            </div>
          </div>
        </div>
      </div>
      <el-button type="primary" style="margin-top: 30px;width:125px" @click="saveMergeTabGroup">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getTabsApi, mergeTabGroup } from '../../../api/OtherApi';
import { dateFormatStr, isEmpty, toast } from '../../../libs/util';
import { CACHE_TABS_GROUP, getStorage, isAuthorization, setStorage } from '@/libs/Storage';
import EventBus from '@/libs/EventBus';

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
      mergeGroupDialogVisible: false,
      tabGroup: [],
      leftIndex: null,
      rightIndex: null
    };
  },
  methods: {
    saveMergeTabGroup () {
      let left = Object.assign({}, this.tabGroup[this.leftIndex]);
      let right = Object.assign({}, this.tabGroup[this.rightIndex]);

      if (isEmpty(left)) {
        toast('请选择需要合并的组(左边)');
        return;
      }
      if (isEmpty(right)) {
        toast('请选择需要合并的目标组(右边)');
        return;
      }
      if (left.id === right.id) {
        toast('无法从自己合并到自己组中');
        return;
      }
      if (isAuthorization()) {
        mergeTabGroup(left.id, right.id).then((res) => {
          this.tabGroup.splice(this.rightIndex, 1, right);
          this.tabGroup.splice(this.leftIndex, 1);
          toast('合并成功');
        });
      } else {
        right.tabs = right.tabs.concat(left.tabs);
        this.tabGroup.splice(this.rightIndex, 1, right);
        this.tabGroup.splice(this.leftIndex, 1);
        setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroup));
        toast('合并成功');
      }
      this.leftIndex = null;
      this.rightIndex = null;
      EventBus.$emit('refresh');
    },
    selectTabGroup (type, index) {
      if (type === 0) {
        this.leftIndex = index;
      }
      if (type === 1) {
        this.rightIndex = index;
      }
    },
    closeDialog () {
      this.mergeGroupDialogVisible = false;
      this.$emit('close');
    },
    formatTime (v) {
      if (isEmpty(v)) {
        return null;
      }
      return dateFormatStr(new Date(v), 'yyyy-MM-dd');
    },
    initMergeGroup () {
      if (isAuthorization()) {
        getTabsApi().then((res) => {
          let _res = res.data.data;
          this.tabGroup = _res;
        });
      } else {
        let temp = getStorage(CACHE_TABS_GROUP);
        if (!isEmpty(temp)) {
          temp = JSON.parse(temp);
          this.tabGroup = temp;
        }
      }
    }
  },
  mounted () {
    this.initMergeGroup();
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

    .merge-title {
      padding: 20px;
    }

    .otp-merge-tip {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 80px;
      color: #0aafef;
      flex-direction: column;

      i {
        transform: rotateZ(90deg);
        color: #0aafef;
        font-size: 35px;
      }
    }

    .otp-group-layout {
      display: flex;
      flex-direction: column;
      height: 500px;
      border: 1px solid #eee;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;

      .otp-group-item {
        height: 40px;
        border: 1px solid #c8c8c8;
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        text-align: left;

        > div:nth-child(1) {
          margin-bottom: 10px;
        }
      }

      .active-item {
        background-color: #1296db;
        color: #FFFFFF;

        div {
          i {
            color: #FFFFFF !important;
          }
        }
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
