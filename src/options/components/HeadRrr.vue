<template>
  <div class="one-tab-options-header">
    <router-link to="/" class="one-tab-options-logo">
      <img src="../../assets/logo.png"/>
      <h2>OneTab Pro</h2>
    </router-link>
    <div class="otp-oh-center">
      <div class="otp-teb-filter">
        <i class="el-icon-search"></i>
        <input v-model="filterKey" @input="onFilter" placeholder="关键字搜索标签页"/>
      </div>
    </div>
    <div class="obp-oh-other">
      <div @click="installBdTab"><h3><a href="">BdTab新标签页</a></h3></div>
      <div><h3><a href="https://www.miniits.com" target="_blank">网站盒子</a></h3></div>
      <div v-if="!isAuthorization" @click="login"><h3>去登录</h3></div>
      <div v-else @click="login">
        <img :src="userInfo.avatar" style="width: 38px;">
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/libs/EventBus';
import { getExplorerInfo } from '@/libs/util';
import { getUserInfo, isAuthorization } from '@/libs/Storage';

export default {
  name: 'HeadRrr',
  data () {
    return {
      userInfo: getUserInfo(),
      isAuthorization: isAuthorization(),
      filterKey: null
    };
  },
  methods: {
    installBdTab () {
      let p = getExplorerInfo();
      let name = p.name.toLowerCase();
      if ('edge' === name) {
        window.open('https://microsoftedge.microsoft.com/addons/detail/achklfoodhcongccglhajeimpfogkjop?hl=zh-CN', '_blank');
        return;
      }
      window.open('https://chrome.google.com/webstore/detail/dnalhngfejihcbdpdeppfjimkjgeggoc/reviews', '_blank');
    },
    login () {
      this.$router.push({
        name: '/login'
      });
    },
    onFilter () {
      EventBus.$emit('filter', this.filterKey);
    }
  },
  mounted () {
    EventBus.$on('loginSuccess', () => {
      this.userInfo = getUserInfo();
      this.isAuthorization = isAuthorization();
    });
  }
};
</script>

<style lang="less" scoped>
.one-tab-options-header {
  background: #232429;
  height: 60px;
  width: 100vw;
  display: flex;

  a {
    text-decoration: none;
  }

  .one-tab-options-logo {
    width: 255px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    color: #fff;

    > img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }

  .otp-oh-center {
    flex: 1;
    display: flex;
    align-items: center;

    .otp-teb-filter {
      width: 225px;
      display: flex;
      justify-content: center;
      border-radius: 48px;
      height: 38px;
      overflow: hidden;
      background: #efefef;
      align-items: center;
      padding-left: 10px;

      > i {
        font-size: 20px;
        padding-right: 10px;
      }

      > input {
        background: #efefef;
        outline: none;
        border: none;
        height: 90%;
        width: 90%;

      }
    }
  }

  .obp-oh-other {
    display: flex;
    align-items: center;
    padding-right: 50px;

    color: #fff;

    > div {
      margin: 0 10px;
      cursor: pointer;
    }

    a {
      color: #fff;
    }
  }
}

</style>
