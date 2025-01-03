<template>
<Viewer :value="value" :plugins="plugins"/>
</template>

<script setup lang="ts">
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight';
import { Viewer} from '@bytemd/vue-next'
import { withDefaults,defineProps } from 'vue';

const plugins = [
  gfm(),
  highlight()
]

/**
 * 定义组件属性类型
 */
 interface Props {
  value: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});


</script>
<style >
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
    display: none;
}
</style>