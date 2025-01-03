import { RouteRecordRaw } from "vue-router";
import accessEnum from "../access/accessEnum";
import UserLayout from "../layouts/UserLayout.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    redirect: "/user/login",
    children: [
      {
        path: "/user/login",
        name: "登录",
        component: import("../views/user/LoginView.vue"),
      },
      // {
      //   path: "/user/register",
      //   name: "注册",
      //   component: () =>
      //     import("../views/user/RegisterView.vue"),
      // },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "主页",
    //component: HomeView,
    redirect: "/question/view",
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/question/view",
    name: "浏览题目",
    component: ViewQuestionView,
  },
  {
    path: "/question/submit/view",
    name: "题目提交列表",
    component: import("../views/question/ViewQuestionSubmitView.vue"),
  },
  {
    path: "/question/view/:id",
    name: "在线做题",
    component: import("../views/question/DoQuestionView.vue"),
    props: true,
    meta: {
      access: accessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: () =>
      import("../views/question/AddQuestionView.vue"),
    meta: {
      access: accessEnum.USER
    },
  },
  {
    path: "/question/manage",
    name: "题目管理",
    component: () =>
      import("../views/question/ManageQuestionView.vue"),
    meta: {
      access: accessEnum.ADMIN
    },
  },
  {
    path: "/question/update",
    name: "题目修改",
    component: () =>
      import("../views/question/AddQuestionView.vue"),
    meta: {
      access: accessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/about/user/list",
    name: "用户列表",
    component: () =>
      import("../views/user/UserListView.vue"),
    meta: {
      access: accessEnum.ADMIN,

    },
  },
  {
    path: "/noFound",
    name: "无权限",
    component: () =>
      import("../views/NoFoundView.vue"),
    meta: {
      hideInMenu: true,
    },
  },
];