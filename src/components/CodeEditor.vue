<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 480px" />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";
/**
* 定义组件属性类型
*/
interface Props {
  value: string,
  language?: string,
  handleChange: (v: string) => void;

}
/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log(v);
  },
});
const codeEditorRef = ref();
const codeEditor = ref();
watch(() => { props.language }, () => {
  if (codeEditor.value) {
    console.log(props.language);
    monaco.editor.setModelLanguage(toRaw(codeEditor.value).getModel(),
      props.language      
    );
  }
},
  { deep: true }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
    snippetSuggestions: 'inline', // 代码提示
    tabCompletion: 'on', // 代码提示按tab完成
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>