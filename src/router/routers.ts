import { RouteRecordRaw } from "vue-router";
import accessEnum from "../access/accessEnum";
import UserLayout from "../layouts/UserLayout.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import LoginView from "../views/user/LoginView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import ViewQuestionSubmitView from "@/views/question/ViewQuestionSubmitView.vue";
import UserListView from "@/views/user/UserListView.vue";
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
        component: LoginView,
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
    component: ViewQuestionSubmitView,
  },
  {
    path: "/question/view/:id",
    name: "在线做题",
    component: () => import("@/views/question/DoQuestionView.vue"),
    props: true,
    meta: {
      access: accessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: accessEnum.USER
    },
  },
  {
    path: "/question/manage",
    name: "题目管理",
    component: ManageQuestionView,
    meta: {
      access: accessEnum.ADMIN
    },
  },
  {
    path: "/question/update",
    name: "题目修改",
    component: AddQuestionView,
    meta: {
      access: accessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/about/user/list",
    name: "用户列表",
    component: UserListView,
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