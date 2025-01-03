<template>
    <a-table :columns="columns" :data="data" 
    :pagination="{showTotal:true
        ,showPageSize:true
        ,pageSizeOptions:[10,20,30,40]
        ,current:pagination.current
        ,pageSize:pagination.pageSize
        ,total}" @page-change="pageChange" @page-size-change="pageSizeChange">
        <template #optional="{ record }">
            <a-space>
                <a-button type="primary" @click="updateById(record)">修改</a-button>
                <a-button status="danger" @click="deleteById(record)">删除</a-button>
            </a-space>
        </template>
    </a-table>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { Question, QuestionControllerService } from '../../../generated';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const total = ref();
const data = ref([]);
const pagination = ref({
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
    const res = await QuestionControllerService.listQuestionByPageUsingPost(pagination.value);
    if (res.code === 0) {
        total.value = res.data.total;
        data.value = res.data.records;
    } else {
        Message.error("获取失败：" + res.message);
    }
}
const updateById = (question: Question) =>{
    router.push({
        path: '/question/update',
        query: {
            id: question.id,
        }
    })
}
const deleteById = async(question: Question) =>{
    const res = await QuestionControllerService.deleteQuestionUsingPost({id: question.id});
    if(res.code===0){
        Message.success("删除成功");
        pageQuery();
    }else{
        Message.error("删除失败："+res.message);
    }
}
const columns = [{
    title: '题号',
    dataIndex: 'id',
}, {
    title: '标题',
    dataIndex: 'title',
}, {
    title: '标签',
    dataIndex: 'tags',
}, {
    title: '内容',
    dataIndex: 'content',
}, {
    title: '答案',
    dataIndex: 'answer'
}, {
    title: '判题配置',
    dataIndex: 'judgeConfig'
}, {
    title: '判题案例',
    dataIndex: 'judgeCase'
}, {
    title: '创建用户ID',
    dataIndex: 'userId'
}, {
    title: '提交数',
    dataIndex: 'submitNum'
}, {
    title: '通过数',
    dataIndex: 'acceptedNum'
},  {
    title: '创建时间',
    dataIndex: 'createTime'
}, {
    title: '修改时间',
    dataIndex: 'updateTime'
}, {
    title: '操作',
    slotName: 'optional'
}
];
onMounted(() => {
    pageQuery();
})
</script>
<style scoped></style>