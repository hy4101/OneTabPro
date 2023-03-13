<template>
  <div class="main_app" id="options">
    <self-header></self-header>
    <!--    <index></index>-->
    <router-view/>
    <!--    <iframe ref="optionsIframe" :src="iframeSrc" width="100%" height="100%"></iframe>-->
  </div>
</template>

<script>

import SelfHeader from '../components/Self-Header.vue';
import EventBus from '@/libs/EventBus';
import { setStorage } from '@/libs/Storage';

export default {
  name: 'options',
  components: {
    SelfHeader
  },
  data () {
    return {
      iframeSrc: null,
      version: '1.3.6'
    };
  },
  mounted () {
    EventBus.$on('system_message', (res) => {
      this.$message({
        message: res.message,
        type: res.type
      });
    });

    chrome.runtime.onMessage.addListener(() => {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
      });
      setStorage('is_up_tab', 1);
      chrome.runtime.openOptionsPage();
    });
  }
};
</script>

<style>
iframe {
  border: 0;
}

.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
