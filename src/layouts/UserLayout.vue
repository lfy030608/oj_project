<template>
    <div id="userLayout">
        <a-layout style="min-height: 100vh">
            <a-layout-header class="header"></a-layout-header>
            <a-layout-content class="content">
                <a-space>
                    <img class="log" src="@/assets/log.jpg" />
                    <h1>O J系统</h1>
                    <router-view />
                </a-space>
            </a-layout-content>
            <a-layout-footer class="footer">
                <a href="https://example.com" target="_blank">宇博客</a>
            </a-layout-footer>
        </a-layout>
    </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
#userLayout {
    text-align: center;
}

#userLayout .log {
    width: 100px;
    height: 97px;
}

#userLayout .content h1 {
    color: #1890ff;
    margin: 10px;
}
</style>