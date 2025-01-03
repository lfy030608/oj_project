<template>
    <div id="questionView">
        <a-form :model="pagination" layout="inline">
            <a-col :span="8">
                <a-form-item field="questionId" label="题目ID" label-col-flex="80px">
                    <a-input v-model="pagination.questionId" placeholder="请输入题目ID" />
                </a-form-item>
            </a-col>
            <a-col :span="8">
                <a-form-item field="language" label="编程语言" label-col-flex="80px">
                    <a-select v-model="pagination.language" :style="{ width: '320px' }" placeholder="请选择语言">
                        <a-option>java</a-option>
                        <a-option>c</a-option>
                        <a-option>python</a-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-form-item>
                <a-button type="primary" @click="query">查询</a-button>
            </a-form-item>
            <a-form-item>
                <a-button type="outline" status="danger" @click="cleanTable">清空</a-button>
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
            <template #createTime="{ record }">
                {{ moment(record.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #judgeInfo="{ record }">
                {{ JSON.stringify(record.judgeInfo) }}
            </template>
            <template #status="{ record }">
                {{ record.status === 0 ? '等待判题' : record.status === 1 ? '判题中' : record.status === 2 ? '判题成功' : '判题失败' }}
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { QuestionSubmitControllerService } from '../../../generated';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';

const total = ref();
const data = ref([]);
const pagination = ref({
    questionId: undefined,
    language: undefined,
    pageSize: 10,
    current: 1,
})
const router = useRouter();
const pageChange = (page: number) => {
    pagination.value.current = page;
    pageQuery();
}
const pageSizeChange = (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    pageQuery();
}
const pageQuery = async () => {
    const res = await QuestionSubmitControllerService.listQuestionSubmitVoByPageUsingPost(pagination.value);
    if (res.code === 0) {
        total.value = res.data.total;
        data.value = res.data.records;
    } else {
        Message.error("获取失败：" + res.message);
    }
}
const query = () => {
    //重置页号
    pagination.value.current = 1;
    pageQuery();
}
const cleanTable = () => {
    pagination.value.questionId = undefined;
    pagination.value.language = undefined;
    query();
}
const columns = [{
    title: '题目提交号',
    dataIndex: 'id',
}, {
    title: '编程语言',
    dataIndex: 'language',
}, {
    title: '判题信息',
    slotName: 'judgeInfo',
}, {
    title: '判题状态',
    slotName: 'status',
}, {
    title: '题目ID',
    dataIndex: 'questionId',
}, {
    title: '创建用户ID',
    dataIndex: 'userId'
}, {
    title: '创建时间',
    slotName: 'createTime'
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