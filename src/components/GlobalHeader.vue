<template>
  <a-row class="grid-demo" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu mode="horizontal" :selected-keys="selectedKeys" @menu-item-click="doMenuClick">
        <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
          <div class="title-bar">
            <img class="logo" src="@/assets/log.jpg" />
            <div class="title">宇 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="store.state.user?.loginUser?.userName === '未登录'">
        <router-link to="/user/login" class="login-link">登录/注册</router-link>
      </div>
      <div v-else>
        <!-- 点击头像出现下拉菜单 -->
        <a-dropdown>
          <a-avatar :style="{ backgroundColor: '#14C9C9' }">
            <template v-if="!loginUser?.userAvatar">
              <img src="@/assets/head.jpg" size="large">
            </template>
            <template v-else>
              <img size="large" :src="loginUser.userAvatar" />
            </template>
            <template #trigger-icon>
              <IconEdit />
            </template>
          </a-avatar>
          <template #content>
            <a-doption v-on:click="editMessage">编辑资料</a-doption>
            <a-doption v-on:click="exit">退出登录</a-doption>
          </template>
        </a-dropdown>
        <a-drawer :width="340" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
          <template #title>
            编辑资料
          </template>
          <div>
            <a-form :model="loginUser" label-align="left" @submit="handleSubmit">
              <a-form-item field="userAvatar" label="头像">
                <a-upload :multiple="false" :show-file-list="false" :list-type="'picture-card'" action="#"
                  :auto-upload="false" @change="Onchange">
                  <template #upload-button>
                    <div v-if="loginUser.userAvatar" class="arco-upload-list-picture custom-upload-avatar">
                      <img :src="loginUser.userAvatar" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress v-if="file && file.status === 'uploading' && file.percent < 100"
                        :percent="file.percent" type="circle" size="mini" :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }" />
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <img src="@/assets/head.jpg" style="width: 81.82px;height: 81.82px;"/>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                      </div>
                    </div>
                  </template>
                </a-upload>

              </a-form-item>
              <a-form-item field="id" label="ID">
                <a-input :readonly="true" v-model="loginUser.id" :style="{ width: '200px' }" />
              </a-form-item>
              <a-form-item field="createTime" label="创建时间">
                <a-date-picker :readonly="true" v-model="loginUser.createTime" :style="{ width: '200px' }" />
              </a-form-item>
              <a-form-item field="userName" label="昵称">
                <a-input v-model="loginUser.userName" :style="{ width: '200px' }" />
              </a-form-item>
              <a-form-item field="userProfile" label="用户简介">
                <a-space direction="vertical" size="large" fill>
                  <a-textarea v-model="loginUser.userProfile" placeholder="这个人很神秘，什么都没写" :style="{ width: '200px' }"
                    :max-length="{ length: 30, errorOnly: true }" allow-clear show-word-limit />
                </a-space>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit">修改</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-drawer>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, computed, readonly } from "vue";
import { routes } from "../router/routers";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { Message } from "@arco-design/web-vue";
import { FileControllerService, UserControllerService } from "../../generated";
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon';
import { FileItem } from "@arco-design/web-vue";
const router = useRouter();
const selectedKeys = ref(['/']);
const store = useStore();
const loginUser = computed(() => store.state.user?.loginUser);
//显示在菜单的路由列表
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    //根据权限过滤
    if (!checkAccess(loginUser.value, item?.meta?.access as any)) {
      return false;
    }
    return true;
  });
});
console.log(visibleRoutes.value)
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const exit = () => {
  Message.success("退出成功");
  router.push({
    path: "/user/login",
  });
};
const visible = ref(false);
const editMessage = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
}

const file = ref();
const Onchange = async (_: any, currentFile: FileItem) => {
  file.value = currentFile;
  // 发送请求给后端
  const res = await FileControllerService.uploadFileUsingPost(currentFile.file as File,"user_avatar")
  if(res.code === 0){
    loginUser.value.userAvatar = res.data;
  }else{
    Message.error("上传失败：" + res.message);
  }
};
//提交修改
const handleSubmit = async () => {
  const res = await UserControllerService.updateMyUserUsingPost(loginUser.value);
  if (res.code === 0) {
    Message.success("修改成功");
  } else {
    Message.error("修改失败：" + res.message);
  }
}
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     username: "江南",
//     userRole: accessEnum.ADMIN
//   })
// }, 3000);
const doMenuClick = (key: string) => {
  router.push(
    {
      path: key
    }
  );
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.title {
  color: #444;
  margin-left: 16px;
}
</style>
