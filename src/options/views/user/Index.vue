<template>
  <div class="personal-center">
    <login v-if="!isAuthorization" @loginSuccess="onLoginSuccess"></login>
    <div class="pc-info" v-else>
      <img :src="userInfo.avatar" @click="isShowAvatars=!isShowAvatars"/>
      <div style="text-align: left;">
        <div> 账户：{{ userInfo.email }}</div>
        <div v-if="userInfo.username"> 用户名：{{ userInfo.username }}</div>
        <div v-if="userInfo.signature"> 个性签名：{{ userInfo.signature }}</div>
        <div v-if="userInfo.createTime"> 注册时间：{{ userInfo.createTime }}</div>
        <h5 style="margin-top: 10px"> 注：点击头像可以设置头像</h5>
      </div>
    </div>
    <div style="display: flex">
      <div v-if="isAuthorization"
           style="margin-top: 10px;text-align: left;color: #0bbd87;cursor: pointer;margin-right: 10px"
           @click="logout">退出登录
      </div>
      <router-link v-if="isAuthorization" to="/"
                   style="margin-top: 10px;text-align: left;color: #0aafef;cursor: pointer;">
        返回首页
      </router-link>
    </div>
    <div class="pc-avatar-list" v-if="isShowAvatars">
      <img v-for="(item,index) in emojis" :src="item" @click="settingUserAvatar('128',index)" :key="item"/>
      <img v-for="(item,index) in avatars" :src="item" @click="settingUserAvatar('avatars',index)" :key="item"/>
    </div>
    <div style="display: flex;margin-top: 20px;align-items: center;">
      关联扩展：
      <a style="padding: 0 10px;" target="_blank" href="https://www.miniits.com/note/open?id=1680232415038">IHome主页</a>
      <a style="padding: 0 10px;" target="_blank" href="https://www.miniits.com/note/open?id=bbdb2d1d-a906-4993-8522-637ef72b773f">IScroll</a>
      <a style="padding: 0 10px;" target="_blank" href="https://www.miniits.com/note/open?id=96cc4130-5475-45d9-b6a1-161ebde0322d">IHistory</a>
    </div>
    <div class="i-scroll-pay">
      此时无声胜有声（打赏作者）
      <div>
        <div class="i-scroll-pay-image">
          <img src="https://image.miniits.com/pay/alipay.png"/>
          <span>支付宝</span>
        </div>
        <div class="i-scroll-pay-image">
          <img src="https://image.miniits.com/pay/wechat_pay.png"/>
          <span>微信</span>
        </div>
        <div class="i-scroll-wechat-image">
          <img src="https://image.miniits.com/miniits_mp_browser_desktop.png"/>
          <span>公众号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, isAuthorization, setUserInfo } from '../../../libs/Storage';
import { toast } from '@/libs/util';
import Login from './Login.vue';
import { logout, settingUserAvatarApi } from '@/api/UserApi';

export default {
  components: {
    Login
  },
  name: 'Index',
  data () {
    return {
      isAuthorization: isAuthorization(),
      isShowAvatars: false,
      userInfo: {},
      avatars: [],
      emojis: []
    };
  },
  methods: {
    logout () {
      this.$confirm('退出后将清除本地信息？', '确认信息', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        callback: (res) => {
          if ('confirm' === res) {
            localStorage.clear();
            toast('退出成功');
            this.isAuthorization = false;
            logout();
          }
        }
      });
    },
    /**
     * 监听登入成功事件
     */
    onLoginSuccess (userInfo) {
      this.isAuthorization = isAuthorization();
      this.userInfo = userInfo;
    },
    /**
     * 设置用户头像
     */
    settingUserAvatar (group, index) {
      // this.userInfo.avatar = 'https://bdimage.miniits.com/emoji/' + group + '/' + (index + 1) + '.png';
      // setUserInfo(this.userInfo);
      let image = 'https://bdimage.miniits.com/emoji/' + group + '/' + (index + 1) + '.png';
      this.userInfo.avatar = image;
      settingUserAvatarApi(image).then((res) => {
        setUserInfo(this.userInfo);
      });
    },
    /**
     * 页面初始化
     */
    init () {
      this.userInfo = getUserInfo();

      for (let i = 1; i < 97; i++) {
        this.emojis.push('https://bdimage.miniits.com/emoji/128/' + i + '.png');
      }
      for (let i = 1; i < 79; i++) {
        this.avatars.push('https://bdimage.miniits.com/emoji/avatars/' + i + '.png');
      }
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style scoped lang="less">
.personal-center {
  padding: 100px;

  .pc-info {
    padding: 20px;
    border: 1px solid #c8c8c8;
    border-radius: 10px;
    display: flex;

    img {
      width: 80px;
      margin-right: 20px;
      cursor: pointer;
    }

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .pc-avatar-list {
    height: 500px;
    overflow-y: auto;
    margin-top: 20px;

    img {
      width: 50px;
      margin: 10px;
      cursor: pointer;
    }
  }

  .i-scroll-pay {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h4 {
      text-align: left;
      margin-left: 10px;
    }

    .i-scroll-pay-image {
      display: flex;
      flex-direction: column;

      > img {
        width: 100px;
        height: 100px;
      }
    }

    .i-scroll-wechat-image {
      display: flex;
      flex-direction: column;

      > img {
        width: 300px;
      }
    }

    img {
      margin: 0 10px;
    }

    > div {
      display: flex;
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
