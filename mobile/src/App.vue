<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { isEmpty, isIframe } from "./libs/util";
import { getStorage, logout, removeAll, removeItem, setStorage } from "./libs/Storage";
import { getUserInfo } from "./api/UserApi.js";

export default {
  name: 'App',
  data () {
    return {
      authorizationLogin: true,
    };
  },
  methods: {
    /**
     * 初始化页面
     */
    initPage () {
      let { token, version, clearData } = this.$route.query;
      if ('clearData' === clearData) {
        removeAll();
        return;
      }
      if ('add_as_bookmark' === clearData) {
        removeItem('bookmarks');
        return;
      }
      setStorage('bd_tab_version', version);
      if (isEmpty(token) && isIframe()) {
        logout();
        return;
      }
      let currentToken = getStorage('Authorization');
      if (token !== currentToken && isIframe()) {
        removeAll();
        setStorage('Authorization', token);
        getUserInfo().then((res) => {
          let userInfo = res.data.data;
          userInfo.authorization = token;
          setStorage('user_info', JSON.stringify(userInfo));
          setStorage('current_use_wallpaper', userInfo.wallpapers);
        }).catch((e) => {
          if (401 === e.data.code) {
            this.$Message.error({
              duration: 0,
              closable: true,
              render: h => {
                return h('span', {
                  style: {
                    color: 'red'
                  },
                }, [
                  '因系统升级：您的登录信息已过期，建议从新登录'
                ]);
              }
            });
          }
        });
      }
    },
  },
  mounted () {
    this.$router.onReady(() => {
      this.initPage();
    });
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}

html, body {
  .size;
  margin: 0;
  padding: 0;
}

#app {
}

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

</style>
