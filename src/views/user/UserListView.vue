<template>
    <a-form :model="pagination" layout="inline">
        <a-col :span="8">
            <a-form-item field="id" label="用户ID" label-col-flex="80px">
                <a-input v-model="pagination.id" placeholder="请输入用户ID" />
            </a-form-item>
        </a-col>
        <a-col :span="8">
            <a-form-item field="userRole" label="用户角色" label-col-flex="80px">
                <a-select v-model="pagination.userRole" :style="{ width: '320px' }" placeholder="请选择用户角色">
                    <a-option value="user" label="用户"></a-option>
                    <a-option value="admin" label="管理员"></a-option>
                    <a-option value="ban" label="封禁"></a-option>
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
        , pageSizeOptions: [10, 20, 30, 40]
        , current: pagination.current
        , pageSize: pagination.pageSize
        , total
    }" @page-change="pageChange" @page-size-change="pageSizeChange">
        <template #optional="{ record }">
            <a-space>
                <a-button status="danger" @click="deleteById(record)">删除</a-button>
            </a-space>
        </template>
        <template #userAvatar="{ record }">
            <a-space v-if="!record?.userAvatar">
                <img src="@/assets/head.jpg" style="width: 60px; height: 60px">
            </a-space>
            <a-space v-else>
                <img :src="record.userAvatar" style="width: 60px; height: 60px">
            </a-space>
        </template>
        <template #createTime="{ record }">
            {{ moment(record.createTime).format('YYYY-MM-DD') }}
        </template>
        <template #userProfile="{ record }">
            <div class="user-profile">
                {{ record.userProfile }}
            </div>
        </template>
        <template #userRole="{ record }">
            {{ record.userRole === 'user' ? '用户' : record.userRole === 'admin' ? '管理员' : '封禁' }}
        </template>
        <template #ban="{ record }">
            <a-button type="text" size="small" class="non" :class="{
                blueBug: record.userRole === 'user',
                delBut: record.userRole === 'ban'
            }" :disabled="record.userRole === 'admin'" @click="statusHandle(record)">
                {{ record.userRole === 'ban' ? '禁用' : '启用' }}
            </a-button>
        </template>
    </a-table>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue';
import { User, UserControllerService } from '../../../generated';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
const total = ref();
const data = ref([]);
const pagination = ref({
    id: undefined,
    userRole: undefined,
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
    const res = await UserControllerService.listUserByPageUsingPost(pagination.value);
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
    pagination.value.id = undefined;
    pagination.value.userRole = undefined;
    query();
}
const deleteById = (user: User) => {
    if (user.userRole === 'admin') {
        Message.error("你没有权限");
        return;
    }
    Modal.confirm({
        title: '提示',
        content: '确定要删除此用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
            const res = await UserControllerService.deleteUserUsingPost({ id: user.id });
            if (res.code === 0) {
                Message.success("删除成功");
                pageQuery();
            } else {
                Message.error("删除失败：" + res.message);
            }
        },
        onCancel: () => {
            Message.error("取消删除");
        },
    });
}
const statusHandle = async (record: User) => {
    const res = await UserControllerService.updateUserUsingPost({
        id: record.id,
        userRole: record.userRole === 'user' ? 'ban' : 'user',
    });
    if (res.code === 0) {
        pageQuery();
        Message.success("修改成功");
    } else {
        Message.error("修改失败：" + res.message);
    }

}
const columns = [{
    title: '头像',
    slotName: 'userAvatar',
}, {
    title: 'ID',
    dataIndex: 'id',
}, {
    title: '昵称',
    dataIndex: 'userName',
}, {
    title: '简介',
    slotName: 'userProfile',
}, {
    title: '角色',
    slotName: 'userRole',
}, {
    title: '创建时间',
    slotName: 'createTime'
}, {
    title: '操作',
    slotName: 'optional'
}, {
    title: '权限管理',
    slotName: 'ban'
}
];
onMounted(() => {
    pageQuery();
})

</script>
<style scoped>
.user-profile {
    white-space: normal;
    /* 允许文本换行 */
    max-width: 150px;
    /* 设置最大宽度，根据实际情况调整 */
}
</style>