import { createApp } from "vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import App from "./App.vue";
import "@arco-design/web-vue/dist/arco.css";
import store from "./store";
import "@/plugins/axios";
import 'bytemd/dist/index.css';
import '@/access/index'

createApp(App).use(ArcoVue).use(store).use(router).mount("#app");
