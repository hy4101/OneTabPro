<template>
  <!--  服务/用户模块-->
  <div class="ss-service-content">
    <div class="user-info-avatar">
      <div>
        <img src="../../../assets/logo.png" style="width:80px;height:80px;border-radius: 10px">
      </div>
      <div>
        <img :src="iconAvatar" style="width:20px;height:20px;border-radius: 10px">
        可以使用IHome(原BdTab)账户直接登录
      </div>
    </div>
    <div class="sss-content">
      <!--     名称       -->
      <div style="font-weight: bolder;font-size: 24px;" class="sssco-login">
        <div style="margin-top: 10px;background-color: rgb(243, 238, 238)">
          <div class="home-search-icon">
            <i class="el-icon-user-solid" type="ios-contact"/>
          </div>
          <input placeholder="邮箱" v-model="login.email"/>
        </div>
        <div style="margin-top: 10px;background-color: rgb(243, 238, 238)">
          <div class="home-search-icon">
            <i class="el-icon-key" type="md-key"/>
          </div>
          <input placeholder="密码" type="password" v-model="login.password"/>
        </div>
        <div style="margin-top: 10px;background-color: rgb(243, 238, 238)" v-if="!isLogin">
          <div class="home-search-icon">
            <i class="el-icon-odometer" type="ios-timer"/>
          </div>
          <input placeholder="验证码" v-model="login.code"/>
          <div class="sdb-send-code-btn" v-if="isSendCode" @click="sendEmailCode">发送</div>
          <div class="sdb-send-code-btn" v-if="!isSendCode">{{ countdown }}</div>
        </div>
      </div>
      <div class="sssc-operating">
        <div class="sssco-login">
          <div v-if="!isLogin" style="background-color: #ffffff00;justify-content: flex-end;cursor: pointer"
               @click="isLogin=true">去登录
          </div>
          <div v-if="isLogin"
               style="background-color: #ffffff00;justify-content: flex-end;cursor: pointer;font-size: 10px"
               @click="isLogin=false">注册 / 忘记
          </div>
        </div>
        <div class="login-btn">
          <div>
            <i class="el-icon-arrow-right" @click="isLoginTip" type="ios-arrow-dropright-circle"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CACHE_TABS_GROUP, getStorage,
  getUserInfo, setStorage,
  setUserInfo
} from '../../../libs/Storage';
import { login, registered, sendCaptcha } from '../../../api/UserApi';
import { dateFormatStr, isEmpty, toast } from '../../../libs/util';
import EventBus from '@/libs/EventBus';
import { getTabsApi } from '@/api/OtherApi';

export default {
  name: 'Login',
  data () {
    return {
      isLoading: false,
      iconAvatar: getUserInfo().avatar || 'https://bdimage.miniits.com/common/logo.png',
      isLogin: true,
      isSendCode: true,
      countdown: 60,
      login: {
        email: null,
        code: null,
        password: null
      }
    };
  },
  methods: {
    /**
     * 登录提示
     */
    isLoginTip () {
      if (isEmpty(this.login.email)) {
        return toast('请输入邮箱！');
      }
      if (isEmpty(this.login.password)) {
        return toast('请输入密码！');
      }
      let tabs = getStorage('cache_tabs_group');
      let s = getStorage('collect_tabs');
      if (!isEmpty(tabs) || !isEmpty(s)) {
        this.$confirm('当前本地有未同步的数据，登录（注册）后将被云端数据覆盖，建议导出备份后再重新操作', '登录/注册提示', {
          confirmButtonText: '取消操作',
          cancelButtonText: '确认—并覆盖数据',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          this.loginOrRegistered();
        });
      } else {
        this.loginOrRegistered();
      }
    },
    /**
     * 登录或注册
     */
    loginOrRegistered () {
      localStorage.clear();
      let loginInfo = this.login;
      if (isEmpty(loginInfo.password)) {
        return;
      }
      this.isLoading = true;
      if (this.isLogin) {
        login(loginInfo).then((res) => {
          toast('登录成功', 'success');
          this.isLoading = false;
          let ui = res.data.data;
          ui.createTime = dateFormatStr(new Date(ui.createTime), 'yyyy-MM-dd');
          setUserInfo(ui);
          this.$emit('loginSuccess', ui);
          EventBus.$emit('loginSuccess');
          this.initTabs();
        }).catch((e) => {
          this.isLoading = false;
          // toast('账户或密码错误', 'error');
        });
      } else {
        if (isEmpty(loginInfo.code)) {
          return;
        }
        registered(loginInfo).then((res) => {
          toast('恭喜您' + res.data.message, 'success');
          this.isLogin = true;
          this.isLoading = false;
        }).catch((e) => {
          toast(e.data.message, 'error');
          this.isLoading = false;
        });
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },

    initTabs () {
      getTabsApi().then((res) => {
        let _res = res.data.data;
        if (isEmpty(_res)) {
          return;
        }
        setStorage(CACHE_TABS_GROUP, JSON.stringify(_res));
      });
    },

    /**
     * 发送验证码
     */
    sendEmailCode () {
      if (isEmpty(this.login.email)) {
        return;
      }
      this.isSendCode = false;
      this.countdown = 60;
      setTimeout(() => {
        this.isSendCode = true;
      }, 1000 * 60);
      this.countDown();
      sendCaptcha({ account: this.login.email }).then((res) => {
      });
    },
    countDown () {
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.ss-service-content {
  position: relative;

  .user-info-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div:nth-child(2) {
      margin-top: 10px;
      display: flex;
      align-items: center;

      > img {

        margin-right: 4px;
      }
    }
  }

  input {
    outline-style: none;
  }

  display: flex;
  flex-direction: column;

  .sss-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .sssco-login {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 525px;

      .login-rotate {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
      }

      .sdb-send-code-btn {
        background-color: #ffffff00;
        justify-content: flex-end;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        width: 50px;
        text-align: center;
        margin-right: 5px;
        border: 1px solid;
        border-radius: 10px;
      }

      > div {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        //background-color: #ffffff;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.2);

        .home-search-icon {
          padding-left: 10px;
          padding-right: 10px;
          display: flex;

          img {
            width: 15px;
            height: 15px;
          }
        }

        > input {
          font-size: 13px;
          width: 90%;
          height: 28px;
          border: 0;
          background: rgba(255, 255, 255, 0);
          color: #353232;
          letter-spacing: 1px;
        }

        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        ::-moz-placeholder { /* Firefox 19+ */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        :-ms-input-placeholder { /* IE 10+ */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        :-moz-placeholder { /* Firefox 18- */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

      }

    }

    .sdb-auth {

      img {
        margin-right: 10px;
      }
    }

    .sdbc-operating {
      display: flex;
      justify-content: center;
      flex-direction: column;

      div {
        display: flex;
      }

      img {
        width: 50px;
      }
    }

    .sdb-login {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 525px;

      .login-rotate {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
      }

      .sdb-send-code-btn {
        background-color: #ffffff00;
        justify-content: flex-end;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        width: 50px;
        text-align: center;
        margin-right: 5px;
        border: 1px solid;
        border-radius: 10px;
      }

      > div {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.2);

        .home-search-icon {
          padding-left: 10px;
          padding-right: 10px;
          display: flex;

          img {
            width: 15px;
          }
        }

        > input {
          font-size: 13px;
          width: 90%;
          height: 28px;
          border: 0;
          background: rgba(255, 255, 255, 0);
          color: #353232;
          letter-spacing: 1px;
        }

        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        ::-moz-placeholder { /* Firefox 19+ */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        :-ms-input-placeholder { /* IE 10+ */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

        :-moz-placeholder { /* Firefox 18- */
          font-size: 12px;
          /*padding-left: 6px;*/
        }

      }

    }

    .sdb-description {
      > div {
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }

    .sdb-operating {
      font-size: 12px;
      color: #348EED;
      display: flex;

      div {
        margin-right: 10px;
        cursor: pointer;
      }
    }

    > div {
      margin: 10px;
    }

    .sssc-operating {
      display: flex;
      justify-content: center;
      flex-direction: column;

      div {
        display: flex;
      }

      .login-btn {
        font-size: 38px;
        display: flex;
        justify-content: center;
        cursor: pointer;

        > div {
          background: #515a6e;
          width: 38px;
          height: 38px;
          border-radius: 38px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          i > {
            font-size: 26px;
          }
        }
      }

    }

  }

  .ss-auth {

  }
}
</style>
