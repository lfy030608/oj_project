<template>
    <div id="addQuestionView">
        <h2>{{ message }}</h2>
    </div>
    <a-form :model="question" label-align="left">
        <a-form-item field="title" label="标题">
            <a-input v-model="question.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item field="tags" label="标签">
            <a-input-tag v-model="question.tags" placeholder="请输入标签" />
        </a-form-item>
        <a-form-item field="level" label="难度" >
            <a-select v-model="question.level" placeholder="请选择难度">
                <a-option value="简单">简单</a-option>
                <a-option value="中等">中等</a-option>
                <a-option value="困难">困难</a-option>
            </a-select>
        </a-form-item>
        <a-form-item field="content" label="题目内容">
            <MdEditor :value="contentMd" :handle-change="contentMdHandleChange" />
        </a-form-item>
        <a-form-item field="answer" label="题目答案">
            <MdEditor :value="answerMd" :handle-change="answerMdHandleChange" />
        </a-form-item>
        <a-form-item label="题目配置" :content-flex="false" :merge-props="false" field="judgeConfig">
            <a-space direction="vertical" style="min-width: 480px;">
                <a-form-item field="timeLimit" label="时间限制">
                    <a-input-number v-model="question.judgeConfig.timeLimit" :default-value="1000" mode="button" />
                </a-form-item>
                <a-form-item field="memoryLimit" label="空间限制">
                    <a-input-number v-model="question.judgeConfig.memoryLimit" :default-value="1000" mode="button" />
                </a-form-item>
                <a-form-item field="stackLimit" label="堆栈限制">
                    <a-input-number v-model="question.judgeConfig.stackLimit" :default-value="1000" mode="button" />
                </a-form-item>
            </a-space>
        </a-form-item>
        <a-form-item label="判题用例" :content-flex="false" :merge-props="false" field="judgeCase">
            <a-form-item v-for="(post, index) of question.judgeCase" :field="`case[${index}].value`" :key="index"
                no-style>
                <a-space direction="vertical" style="min-width: 480px;">
                    <a-form-item :field="`input[${index}].value`" :label="`输入用例-${index}`" :key="index">
                        <a-input v-model="post.input" />
                    </a-form-item>
                    <a-form-item :field="`output[${index}].value`" :label="`输出用例-${index}`" :key="index">
                        <a-input v-model="post.output" />
                    </a-form-item>
                    <a-button @click="handleDelete(index)" status="danger">Delete Case</a-button>
                </a-space>
            </a-form-item>
            <br><br>
            <div>
                <a-button @click="handleAdd" type="outline" status="success"> Add Case</a-button>
            </div>
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit" type="primary" @click="submit">提交</a-button>
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import MdEditor from '@/components/MdEditor.vue';
import { Message } from '@arco-design/web-vue';
import { QuestionControllerService } from '../../../generated';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const check = route.path.includes('/question/update')
const message = ref('创建题目');
//数据回显
const showQuestion = async () => {
    if (check) {
        message.value = '更新题目';
        const id = route.query.id;
        const res = await QuestionControllerService.getQuestionByIdUsingGet(id as any);
        if (res.code === 0) {
            question.value = res.data as any;
            console.log(question.value);
            contentMd.value = question.value.content;
            answerMd.value = question.value.answer;
            //进行json转js对象
            if (!question.value.judgeCase) {
                question.value.judgeCase = [
                    {
                        "input": "",
                        "output": ""
                    }
                ];
            } else {
                question.value.judgeCase = JSON.parse(question.value.judgeCase as any);
            }
            if (!question.value.judgeConfig) {
                question.value.judgeConfig = {
                    "memoryLimit": 1000,
                    "stackLimit": 1000,
                    "timeLimit": 1000
                }
            } else {
                question.value.judgeConfig = JSON.parse(question.value.judgeConfig as any);
            }
            if (!question.value.tags) {
                question.value.tags = [];
            } else {
                question.value.tags = JSON.parse(question.value.tags as any);
            }
        } else {
            Message.error("获取参数失败：" + res.message);
        }
    } else {
        message.value = '创建题目';
        return;
    }
}
onMounted(() => {
    showQuestion();
})
const question = ref({
    "answer": "",
    "content": "",
    "judgeCase": [
        {
            "input": "",
            "output": ""
        }
    ],
    "judgeConfig": {
        "memoryLimit": 1000,
        "stackLimit": 1000,
        "timeLimit": 1000
    },
    "tags": [],
    "title": "",
    "level": ""
});
const handleAdd = () => {
    question.value.judgeCase.push({
        input: '',
        output: ''
    })
};
const handleDelete = (index: number) => {
    question.value.judgeCase.splice(index, 1)
}
const contentMd = ref("");
const answerMd = ref("");
const contentMdHandleChange = (v: string) => {
    contentMd.value = v;
    question.value.content = v;
}
const answerMdHandleChange = (v: string) => {
    answerMd.value = v;
    question.value.answer = v;
}
const updated = async () => {
    const res = await QuestionControllerService.updateQuestionUsingPost(question.value);
    if (res.code === 0) {
        Message.success("更新成功");
    } else {
        Message.error("更新失败：" + res.message);
    }
}
const submit = async () => {
    //区分新增还是更新
    if (check) {
        updated();
    } else {
        const res = await QuestionControllerService.addQuestionUsingPost(question.value);
        if (res.code === 0) {
            Message.success("添加成功");
        } else {
            Message.error("添加失败：" + res.message);
        }
    }
}
</script>

<style scoped></style>