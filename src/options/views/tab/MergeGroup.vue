<template>
  <div class="otp-merge-group">
    <el-dialog title="合并分组" :visible.sync="mergeGroupDialogVisible" width="30%"
               :before-close="closeDialog">
      <div class="otp-merge-group-dialog">

        <div class="otp-group-from otp-group-layout">
          <div v-for="(item,index) in tabGroup" @click="selectTabGroup(0,index)" :key="item.id"
               :class="['otp-group-item', leftIndexs.includes(index)?'active-item':'']">
            <div>
              {{ item.name }}
            </div>
            <div>
              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.tabs.length }}</i>
              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.createDate * 1000) }}</i>
            </div>
          </div>
        </div>
        <!--        <div class="otp-group-to otp-group-layout">-->
        <!--          <div v-for="(item,index) in tabGroup" @click="selectTabGroup(1,index)" :key="item.id"-->
        <!--               :class="['otp-group-item',index===rightIndex?'active-item':'']">-->
        <!--            <div>-->
        <!--              {{ item.name }}-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              <i class="el-icon-paperclip" style="margin-right: 10px;color:#939cac"> {{ item.tabs.length }}</i>-->
        <!--              <i class="el-icon-time" style="color:#939cac"> {{ formatTime(item.createDate * 1000) }}</i>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <el-button type="primary" :disabled="disabledMerging" style="margin-top: 30px;" @click="saveMergeTabGroup">
        确认合并{{ leftIndexs.length > 0 ? '(已选' + leftIndexs.length + '组)' : '' }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getTabsApi, mergeTabGroup, mergeTabGroup2 } from '../../../api/OtherApi';
import { dateFormatStr, isEmpty, toast, uuid } from '../../../libs/util';
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
        this.leftIndex = null;
        this.rightIndex = null;
        this.leftIndexs = [];
        this.initMergeGroup();
      }
    }
  },
  data () {
    return {
      disabledMerging: false,
      mergeTitle: '合并分组',
      mergeGroupDialogVisible: false,
      tabGroup: [],
      leftIndexs: [],
      leftIndex: null,
      rightIndex: null
    };
  },
  methods: {
    saveMergeTabGroup () {
      if (this.leftIndexs.length <= 1) {
        return toast('请选择需要合并的组');
      }

      this.disabledMerging = true;
      let tabGroup = [...this.tabGroup];
      let merger = [];
      let mergerGroupIds = [];
      for (const index of this.leftIndexs) {
        let tab = tabGroup[index];
        merger = merger.concat(tab.tabs);
        mergerGroupIds.push(tab.id);
      }

      tabGroup = tabGroup.filter((e, index) => !this.leftIndexs.includes(index));

      let newTab = {
        createDate: new Date().getTime(),
        id: uuid(),
        name: '来自：合并的标签组',
        tabGroup: new Date().getTime(),
        tabs: merger
      };
      tabGroup.splice(0, 0, newTab);
      if (isAuthorization()) {
        mergeTabGroup2(mergerGroupIds).then((res) => {
          this.disabledMerging = false;
          let _res = res.data.data;
          this.tabGroup = _res;
          toast('合并成功');
          setStorage(CACHE_TABS_GROUP, JSON.stringify(res.data));
          EventBus.$emit('refresh');
        });
      } else {
        this.disabledMerging = false;
        this.tabGroup = tabGroup;
        setStorage(CACHE_TABS_GROUP, JSON.stringify(this.tabGroup));
        toast('合并成功');
        EventBus.$emit('refresh');
      }
      this.leftIndexs = [];
    },
    selectTabGroup (type, index) {
      if (type === 0) {
        this.leftIndex = index;
        let ids = [...this.leftIndexs];
        if (!ids.includes(index)) {
          ids.push(index);
        } else {
          ids = ids.filter(i => i !== index);
        }
        this.leftIndexs = ids;
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
    // this.initMergeGroup();
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
    //  flex-direction: column;
    // height: 500px;

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
