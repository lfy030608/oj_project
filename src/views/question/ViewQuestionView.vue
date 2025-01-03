<template>
    <div id="questionView">


        <a-form :model="pagination" layout="inline">
            <a-col :span="7">
            <a-form-item label="难度" field="level" label-col-flex="80px">
                <a-select v-model="pagination.level" :style="{ width: '280px' }" placeholder="请选择难度" >
                    <a-option value="简单" label="简单"  @click="levelQuery"></a-option>
                    <a-option value="中等" label="中等"  @click="levelQuery"></a-option>
                    <a-option value="困难" label="困难"  @click="levelQuery"></a-option>
                </a-select>
            </a-form-item>
        </a-col>
            <a-col :span="7">
                <a-form-item field="title" label="标题" label-col-flex="80px">
                    <a-input v-model="pagination.title" placeholder="请输入标题" />
                </a-form-item>
            </a-col>
            <a-col :span="7">
                <a-form-item field="tags" label="标签" label-col-flex="80px">
                    <a-input-tag v-model="pagination.tags" placeholder="请输入标签" />
                </a-form-item>
            </a-col>
            <a-form-item>
                <a-button type="primary" @click="query">查询</a-button>
            </a-form-item>
        </a-form>
        <br><br>
        <a-table :columns="columns" :data="data" :pagination="{
            showTotal: true
            , showPageSize: true
            , pageSizeOptions: [5, 10, 15, 20]
            , current: pagination.current
            , pageSize: pagination.pageSize
            , total
        }" @page-change="pageChange" @page-size-change="pageSizeChange">
            <template #tags="{ record }">
                <a-span wrap>
                    <a-tag v-for="(tag, index) of record.tags" :key="index" color="green">
                        {{ tag }}</a-tag>
                </a-span>
            </template>
            <template #level="{ record }">
                <a-span wrap>
                    <a-tag  :color="getColor(record.level)">
                        {{ record.level }}</a-tag>
                </a-span>
            </template>
            <template #passingRate="{ record }">
                <a-progress :percent="record.submitNum ? (record.acceptedNum / record.submitNum).toFixed(3) : 0 as any"
                    :color="'#0fc6c2'" show-info="false" />
            </template>
            <template #createTime="{ record }">
                {{ moment(record.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #optional="{ record }">
                <a-button type="primary" @click="toQuestionById(record)">做题</a-button>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { Question, QuestionControllerService, QuestionVO } from '../../../generated';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
const total = ref();
const data = ref<QuestionVO[]>([]);
const pagination = ref({
    title: "",
    tags: [],
    level: "",
    pageSize: 10,
    current: 1,
})
const router = useRouter();
const getColor = (level: string) => {
    switch (level) {
        case "简单":
            return "green";
        case "中等":
            return "orange";
        case "困难":
            return "red";
        default:
            return "green";
    }
}
const pageChange = (page: number) => {
    pagination.value.current = page;
    pageQuery();
}
const pageSizeChange = (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pageQuery();
}
const pageQuery = async () => {
    const res = await QuestionControllerService.listQuestionVoByPageUsingPost(pagination.value);
    if (res.code === 0) {
        total.value = res.data.total;
        data.value = res.data.records;
    } else {
        Message.error("获取失败：" + res.message);
    }
}
const levelQuery = async () => {
    pagination.value.current = 1;
    pageQuery();
}
const toQuestionById = (question: Question) => {
    router.push({
        path: `/question/view/${question.id}`,
    })
}
const query = () => {
    //重置页号
    pagination.value.current = 1;
    pageQuery();
}

const columns = [{
    title: '题号',
    dataIndex: 'id',
}, {
    title: '难度',
    slotName: 'level'
},{
    title: '标题',
    dataIndex: 'title',
},{
    title: '标签',
    slotName: 'tags',
}, {
    title: '通过率',
    slotName: 'passingRate'
}, {
    title: '创建用户ID',
    dataIndex: 'userId'
}, {
    title: '创建时间',
    slotName: 'createTime'
}, {
    title: '操作',
    slotName: 'optional'
}
];
onMounted(() => {
    pageQuery();
})
</script>
<style scoped>
#questionView {
    max-width: 1200px;
    margin: 0 auto;
}
</style>