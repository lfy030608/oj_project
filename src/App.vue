<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style scoped>
#app {}
</style>
<script setup lang="ts">
import BasicLayout from "./layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
/*
* 全局初始化
*/
const doInit = () => {
  console.log("doInit");
}
onMounted(() => {
  doInit();
})

</script>
