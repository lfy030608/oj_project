<template>
    <div class="login-container">
        <a-tabs default-active-key="login">
            <a-tab-pane key="login" title="登录">
                <a-form class="login-form" style="max-width: 480px; margin: 0 auto" label-align="left" auto-label-width
                    :model="loginForm" @submit="handleLogin">
                    <a-form-item field="userAccount" label="用户名">
                        <a-input v-model="loginForm.userAccount" placeholder="请输入用户名" />
                    </a-form-item>
                    <a-form-item field="userPassword" label="密码">
                        <a-input-password v-model="loginForm.userPassword" placeholder="请输入密码" />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" style="margin-right: 20px;">登录</a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="register" title="注册">
                <a-form class="register-form" style="max-width: 480px; margin: 0 auto" label-align="left"
                    auto-label-width :model="registerForm" @submit="handleRegister">
                    <a-form-item field="userAccount" label="用户名">
                        <a-input v-model="registerForm.userAccount" placeholder="请输入用户名" />
                    </a-form-item>
                    <a-form-item field="userPassword" label="密码">
                        <a-input-password v-model="registerForm.userPassword" placeholder="请输入密码" />
                    </a-form-item>
                    <a-form-item field="checkPassword" label="确认密码">
                        <a-input-password v-model="registerForm.checkPassword" placeholder="请确认密码" />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" status="success" html-type="submit"
                            style="margin-right: 20px;">注册</a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { UserControllerService } from '../../../generated';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const loginForm = ref({
    userAccount: '',
    userPassword: '',
});
const registerForm = ref({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
});

const handleRegister = async () => {
    if (registerForm.value.userPassword !== registerForm.value.checkPassword) {
        Message.error("两次密码不一致")
        return
    }
    const res = await UserControllerService.userRegisterUsingPost(registerForm.value)
    if (res.code === 0) {
        Message.success("注册成功，请先完成登录")
    } else {
        Message.error("注册失败：" + res.message)
    }
}
const handleLogin = async () => {
    const res = await UserControllerService.userLoginUsingPost(loginForm.value)
    if (res.code === 0) {
        await store.dispatch("user/getLoginUser")
        Message.success("登录成功")
        router.push({
            path: '/',
            replace: true
        })
    } else {
        Message.error("登录失败：" + res.message)
    }
};
onMounted(() => {
    loginForm.value.userAccount = '';
    loginForm.value.userPassword = '';
});
</script>
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;

}
.login-form,
.register-form {
    max-width: 480px;
    margin: 0 auto;
}
</style>