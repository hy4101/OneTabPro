import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import { isEmpty } from "@/libs/util";

Vue.use(Router);
const router = new Router({
  routes,
  mode: 'history',
});

//2.使用router.beforeEach对路由进行遍历，设置title
router.beforeEach((to, from, next) => {
  //beforeEach是router的钩子函数，在进入路由前执行
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // if (to.meta.logo) {
  //   let favicon = document.querySelector('link[rel="shortcut icon"]');
  //   favicon.href = to.meta.logo;
  // }
  // if (!isEmpty(to.name) && to.name.indexOf('note') >= 0) {
  //   let favicon = document.querySelector('link[rel="shortcut icon"]');
  //   favicon.href = 'https://bdimage.miniits.com/sys_app/note.png';
  // }
  next();
});

export default router;
