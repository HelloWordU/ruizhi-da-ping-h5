import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/homePage/HomeView.vue";
import login from "../views/login/loginView.vue";
import editPassword from "../views/editPassword/editPassword.vue";
import second from "../views/second/secondPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: {
        title: "首页",
        login: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        title: "登录",
      },
    },
    {
      path: "/edit/password",
      name: "editPassword",
      component: editPassword,
      meta: {
        title: "修改密码",
        login: true,
      },
    },
    {
      path: "/second",
      name: "second",
      component: second,
      meta: {
        login: true,
        keepAlive: true,
      },
    },
    {
      path: "/dataShow",
      name: "dataShow",
      component: () => import("@/views/dataShow/dataShow.vue"),
      meta: {
        login: true,
      },
    },
    {
      path: "/negativePage",
      name: "negativePage",
      component: () => import("@/views/negativePage/negativePage.vue"),
      meta: {
        login: true,
      },
    },
    {
      path: "/remarkPage",
      name: "remarkPage",
      component: () => import("@/views/remarkPage/remarkPage.vue"),
      meta: {
        login: true,
      },
    },
    {
      path: "/commentNegative",
      name: "commentNegative",
      component: () => import("@/views/commentNegative/commentNegative.vue"),
      meta: {
        login: true,
      },
    },
  ],
});

router.beforeEach((to, form, next) => {
  const { meta = {} } = to || {};
  const { title, login } = meta;
  if (login && !localStorage.getItem("accessToken")) {
    window.location.replace("/login");
    return;
  }
  const routerTitle: string = `${title || ""}`;
  if (routerTitle) window.document.title = routerTitle;
  next();
});
router.afterEach((to, form) => {
  if (!to.meta.keepAlive) {
    window.scrollTo(0, 0);
  }
});
export default router;
