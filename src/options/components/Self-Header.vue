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
      <div @click="installBdTab"><a href="">IHome新标签页</a></div>
      <div><a href="https://www.miniits.com" target="_blank">网站盒子</a></div>
      <div v-if="!isAuthorization" @click="login">去登录</div>
      <div v-else @click="login">
        <img :src="userInfo.avatar" style="width: 22px;">
      </div>
      <div class="obp-github">
        <a href="https://github.com/hy4101/OneTabPro" target="_blank">
          <svg t="1678696288929" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="3759" width="22" height="22">
            <path
              d="M512 64a448 448 0 1 0 0 896A448 448 0 0 0 512 64z m118.08 813.248h-3.456a19.2 19.2 0 0 1-14.272-5.248 19.2 19.2 0 0 1-5.248-13.888v-52.48c0.256-17.472 0.384-35.072 0.384-52.864 0-12.992-1.92-25.92-5.632-38.4a68.352 68.352 0 0 0-20.224-32.64c26.048-2.56 51.648-8.448 76.16-17.6a143.232 143.232 0 0 0 87.744-92.224c7.936-25.728 11.712-52.544 11.136-79.488a154.368 154.368 0 0 0-9.728-55.104 145.152 145.152 0 0 0-29.632-47.936c2.752-7.04 4.8-14.336 6.016-21.76a133.504 133.504 0 0 0-1.472-51.392 197.632 197.632 0 0 0-8.256-28.48 10.88 10.88 0 0 0-4.16-0.768h-4.096a84.032 84.032 0 0 0-25.152 4.16 192.64 192.64 0 0 0-26.24 9.728c-8.448 3.84-16.704 8.064-24.704 12.8a433.792 433.792 0 0 0-21.376 13.504 357.568 357.568 0 0 0-192 0 504.256 504.256 0 0 0-21.376-13.504 224.896 224.896 0 0 0-25.088-12.8 168.576 168.576 0 0 0-26.24-9.728 82.24 82.24 0 0 0-24.768-4.16h-4.096a10.816 10.816 0 0 0-4.096 0.768c-3.52 9.28-6.4 18.816-8.64 28.48a141.184 141.184 0 0 0-1.088 51.392c1.28 7.424 3.2 14.72 5.952 21.76a145.152 145.152 0 0 0-29.568 47.936 154.624 154.624 0 0 0-9.792 55.104c-0.512 26.752 3.2 53.44 10.88 79.104 6.784 21.056 18.048 40.32 33.024 56.64 15.488 15.744 34.176 27.968 54.72 35.968 24.384 9.344 49.92 15.36 75.904 17.792a68.224 68.224 0 0 0-16.896 23.616 111.616 111.616 0 0 0-7.488 27.776 102.784 102.784 0 0 1-43.84 10.112 66.688 66.688 0 0 1-39.68-11.264 108.352 108.352 0 0 1-28.16-30.72 100.48 100.48 0 0 0-24.768-27.072 68.608 68.608 0 0 0-16.128-8.96 44.736 44.736 0 0 0-28.48-2.624 15.36 15.36 0 0 0-4.864 2.24 4.416 4.416 0 0 0-2.24 3.712 12.352 12.352 0 0 0 5.248 9.024c3.456 2.752 6.4 4.928 8.64 6.4l1.088 0.768c4.992 3.84 9.792 8 14.272 12.416 4.224 3.648 8 7.808 11.2 12.352 3.392 4.416 6.272 9.152 8.64 14.208 2.752 4.992 5.632 10.752 8.64 17.28 7.04 17.664 19.456 32.64 35.584 42.752 16.96 9.088 35.904 13.568 55.104 13.12 6.528 0 13.056-0.384 19.52-1.152 6.4-1.024 12.8-2.112 19.2-3.392V857.6a18.688 18.688 0 0 1-19.84 19.456h-2.368a384 384 0 1 1 236.16 0v0.192z"
              fill="#FFFFFF" p-id="3760"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/libs/EventBus';
import { getExplorerInfo } from '@/libs/util';
import { getUserInfo, isAuthorization } from '@/libs/Storage';

export default {
  name: 'SelfHeader',
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
      width: 255px;
      display: flex;
      justify-content: center;
      border-radius: 10px;
      height: 38px;
      overflow: hidden;
      background: #ffffff;
      align-items: center;
      padding-left: 10px;

      > i {
        font-size: 20px;
        padding-right: 10px;
      }

      > input {
        background: #ffffff;
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
    font-size: 12px;

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
