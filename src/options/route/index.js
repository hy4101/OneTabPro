import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';

Vue.use(Router);
const router = new Router({
  routes,
  mode: 'hash'
  // base: '/dist/',
  // mode: 'history',
});

// 2.使用router.beforeEach对路由进行遍历，设置title
router.beforeEach((to, from, next) => {
  // beforeEach是router的钩子函数，在进入路由前执行
  if (to.meta.title) {
    // 判断是否有标题
    document.title = to.meta.title;
  }
  next();
});

export default router;
