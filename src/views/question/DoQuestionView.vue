<template>
    <div id="doQuestionView">
        <a-row :gutter="[24, 24]">
            <a-col :md="12" :xs="24">
                <a-tabs default-active-key="content" v-model:activeKey="activeKey">
                    <a-tab-pane key="content" title="题目">
                        <a-card v-if="data" :title="data.title">
                            <template #extra>
                                <a-tag v-for="(tag, index) of data?.tags" :key="index" color="green"
                                    style="margin-right: 8px;">
                                    {{ tag }}
                                </a-tag>
                            </template>
                            <a-descriptions :data="data?.judgeConfig as any" title="题目配置"
                                :column="{ xs: 1, md: 2, lg: 3 }" size="medium">
                                <a-descriptions-item label="时间限制">
                                    <a-tag>{{ data?.judgeConfig?.timeLimit + "ms" }}</a-tag>
                                </a-descriptions-item>
                                <a-descriptions-item label="内存限制">
                                    <a-tag>{{ data?.judgeConfig?.memoryLimit + "kb" }}</a-tag>
                                </a-descriptions-item>
                                <a-descriptions-item label="堆栈限制">
                                    <a-tag>{{ data?.judgeConfig?.stackLimit + "kb" }}</a-tag>
                                </a-descriptions-item>
                            </a-descriptions>
                            <ViewEditor :value="data.content || ''" />
                        </a-card>
                    </a-tab-pane>
                    <a-tab-pane key="comment" title="评论" pagination>
                        <div class="wrapper">
                            <ul id="basic-demo">
                                <a-comment align="right">
                                    <template #actions>
                                        <a-button key="1" type="primary" @click="sendComment"> 发送 </a-button>
                                    </template>
                                    <template #content>
                                        <a-textarea id="commentInput" placeholder="Please enter something" :auto-size="{
                                            minRows: 2,
                                            maxRows: 3
                                        }" style="margin-top: 20px" v-model="commentAddRequest.content" />
                                    </template>
                                    <template #avatar>
                                        <a-avatar>
                                            <template v-if="!loginUser?.userAvatar">
                                                <img src="@/assets/head.jpg" size="large">
                                            </template>
                                            <template v-else>
                                                <img size="large" :src="loginUser.userAvatar" />
                                            </template>
                                        </a-avatar>
                                    </template>
                                </a-comment>
                                <li v-for="(fatherComment, index) of userComment" :key="index">
                                    <a-comment :author="fatherComment?.userName" :content="fatherComment?.content"
                                        :datetime="moment(fatherComment?.createTime).format('YYYY-MM-DD HH:mm')">
                                        <template #actions>
                                            <span class="action" key="heart"
                                                @click="onLikeChange(fatherComment, undefined)">
                                                <span v-if="fatherComment?.hasThumb">
                                                    <IconHeartFill :style="{ color: '#f53f3f' }" />
                                                </span>
                                                <span v-else>
                                                    <IconHeart />
                                                </span>
                                                {{ fatherComment?.thumbNum }}
                                            </span>
                                            <span class="action" key="reply"
                                                @click="onReplyChange(fatherComment, undefined)">
                                                <IconMessage /> 回复
                                            </span>
                                            <span v-if="exitsComment[fatherComment.id as any]" class="action"
                                                key="expand" @click="queryReplyComment(fatherComment)">
                                                <IconExpand /> 评论区 {{ totalComment[fatherComment?.id as any] }}
                                            </span>
                                            <template v-if="isReplying[fatherComment?.id as any]">
                                                <a-textarea v-model="replyContent[fatherComment?.id as any]"
                                                    placeholder="请输入回复内容" :auto-size="{
                                                        minRows: 1,
                                                        maxRows: 3
                                                    }" />
                                                <a-button @click="submitReply(fatherComment, undefined)"
                                                    type="primary">提交</a-button>
                                            </template>
                                        </template>
                                        <template #avatar>
                                            <a-avatar>
                                                <template v-if="!fatherComment?.userAvatar">
                                                    <img src="@/assets/head.jpg" size="large">
                                                </template>
                                                <template v-else>
                                                    <img size="large" :src="fatherComment.userAvatar" />
                                                </template>
                                            </a-avatar>
                                        </template>
                                    </a-comment>
                                    <div class="reply" v-if="expandedComments[fatherComment.id as any]">
                                        <ul>
                                            <li v-for="(reply, replyIndex) of replyUserComment" :key="replyIndex">
                                                <a-comment :author="reply?.userName" :content="reply?.content"
                                                    :datetime="moment(reply?.createTime).format('YYYY-MM-DD HH:mm')">
                                                    <template #avatar>
                                                        <a-avatar>
                                                            <template v-if="!reply?.userAvatar">
                                                                <img src="@/assets/head.jpg" size="large">
                                                            </template>
                                                            <template v-else>
                                                                <img size="large" :src="reply.userAvatar" />
                                                            </template>
                                                        </a-avatar>
                                                    </template>
                                                    <template #actions>
                                                        <span class="action" key="heart"
                                                            @click="onLikeChange(reply, fatherComment)">
                                                            <span v-if="reply?.hasThumb">
                                                                <IconHeartFill :style="{ color: '#f53f3f' }" />
                                                            </span>
                                                            <span v-else>
                                                                <IconHeart />
                                                            </span>
                                                            {{ reply?.thumbNum }}
                                                        </span>
                                                        <span class="action" key="sonReply"
                                                            @click="onReplyChange(fatherComment, reply)">
                                                            <IconMessage /> 回复
                                                        </span>
                                                        <template v-if="isReplying[reply?.id as any]">
                                                            <a-textarea v-model="replyContent[reply?.id as any]"
                                                                placeholder="请输入回复内容" :auto-size="{
                                                                    minRows: 1,
                                                                    maxRows: 3
                                                                }" />
                                                            <a-button @click="submitReply(fatherComment, reply)"
                                                                type="primary">提交</a-button>
                                                        </template>
                                                    </template>

                                                </a-comment>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                            <a-pagination v-model:current="pagination.current" :total="total"
                                :page-size="pagination.pageSize" :show-total="false"
                                @change="pageChange"></a-pagination>
                            <a-back-top target-container="#basic-demo" :style="{ position: 'absolute' }" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="aiAnswer" title="AI解答">
                        <AiTalkServe :question-id="param.id" />
                    </a-tab-pane>
                </a-tabs>
            </a-col>
            <a-col :md="12" :xs="24">
                <a-select v-model="requestMessage.language" :style="{ width: '320px' }" placeholder="请选择语言">
                    <a-option>java</a-option>
                    <a-option>c</a-option>
                    <a-option>python</a-option>
                </a-select>
                <div v-if="requestMessage.language === 'java'">
                    <CodeEditor :value="requestMessage.code as string" :language="requestMessage?.language as string"
                        :handle-change="handleChange" />
                </div>
                <div v-else-if="requestMessage.language === 'c'">
                    <CodeEditor :value="requestMessage.code as string" :language="requestMessage?.language as string"
                        :handle-change="handleChange" />
                </div>
                <div v-else-if="requestMessage.language === 'python'">
                    <CodeEditor :value="requestMessage.code as string" :language="requestMessage?.language as string"
                        :handle-change="handleChange" />
                </div>
                <div v-else>
                    <CodeEditor :value="requestMessage.code as string" :language="requestMessage?.language as string"
                        :handle-change="handleChange" />
                </div>
                <a-divider :size="0" />
                <a-button type="primary" @click="handleSubmit">提交</a-button>
                <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" draggable height='400px'>
                    <template #title>
                        {{ questionSubmitVo?.judgeInfo?.message }}
                        <a-spin :hide-icon="loading" />
                    </template>
                    <div>
                        <a-span style="margin-right: 60px;">
                            耗时：{{ questionSubmitVo?.judgeInfo?.time }}ms
                        </a-span>
                        内存占用：{{ questionSubmitVo?.judgeInfo?.memory }}kb
                    </div>
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { CommentControllerService, CommentThumbControllerService, QuestionControllerService, QuestionSubmitAddRequest, QuestionSubmitControllerService, QuestionSubmitVO, QuestionVO } from '../../../generated';
import { defineProps, onMounted, ref, watch, withDefaults, reactive, computed } from 'vue'
import CodeEditor from "@/components/CodeEditor.vue";
import ViewEditor from '@/components/ViewEditor.vue';
import moment from 'moment';
import { CommentVO, CommentAddRequest } from '../../../generated';
import {
    IconHeart,
    IconMessage,
    IconHeartFill,
    IconExpand
} from '@arco-design/web-vue/es/icon';
import store from '@/store';
import AiTalkServe from '../ai/AiTalkServe.vue';
const loginUser = computed(() => store.state.user?.loginUser);
interface props {
    id: string,
}
const param = withDefaults(defineProps<props>(), {
    id: () => ""
})
const isReplying = reactive<{ [key: number]: boolean }>({});
const activeKey = ref('content');
const data = ref<QuestionVO>()
const initCode = ref({
    java: `import java.util.Scanner;
// 类名必须Main, 不可修改
public class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        //在此输入您的代码...
        scan.close();
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
  // 请在此输入您的代码
  return 0;
}`,
    python: `import os
import sys

# 请在此输入您的代码
    `
})
const requestMessage = ref<QuestionSubmitAddRequest>({
    language: "",
    code: "",
})
const questionSubmitVo = ref<QuestionSubmitVO>()
const visible = ref(false);
const loading = ref(false);

const userComment = ref<CommentVO[]>([])
const replyUserComment = ref<CommentVO[]>([])
const expandedComments = reactive<{ [key: number]: boolean }>({});
const commentAddRequest = ref<CommentAddRequest>({
    content: "",
    questionId: param.id as any,
})
const replyComment = ref({
    content: "",
    questionId: param.id as any,
    replyId: undefined,
    replyFatherId: undefined
})
const replyContent = reactive<{ [key: number]: string }>({});
const total = ref()
const pagination = ref({
    questionId: param.id,
    pageSize: 10,
    current: 1,
})
const lastThumbsUpTime = ref<{ [key: string]: number }>({});
const totalComment = reactive<{ [key: number]: number }>({});
const exitsComment = ref<{ [key: number]: boolean }>({});

const queryReplyComment = async (fatherComment: CommentVO) => {
    for (const key in expandedComments) {
        if (key !== fatherComment.id as any) {
            expandedComments[key] = false;
        }
        if (key === fatherComment.id as any && expandedComments[key]) {
            expandedComments[key] = false;
            return;
        }
    }
    replyUserComment.value = []
    const res = await CommentControllerService.listCommentVoByCommentIdUsingGet(fatherComment.id as any)
    if (res.code === 0) {
        Message.success("操作成功")
        replyUserComment.value = res.data?.commentVOList as any
        totalComment[fatherComment.id as any] = res.data?.totalComment as any
        expandedComments[fatherComment.id as any] = !expandedComments[fatherComment.id as any];
    } else {
        Message.error(res?.message as any)
    }
}
const getCommentByIdList = async (fatherComment: CommentVO, replyFatherId: any) => {
    const res = await CommentControllerService.listCommentVoByCommentIdUsingGet(fatherComment.id as any)
    if (res.code === 0) {
        console.log(res.data);
        if (replyFatherId) {
            replyUserComment.value = res.data?.commentVOList as any
        }
        totalComment[fatherComment.id as any] = res.data?.totalComment as any
        if (totalComment[fatherComment.id as any]) {
            exitsComment.value[fatherComment.id as any] = true
        }
    } else {
        console.log(res.message);
    }
}
const onReplyChange = (fatherComment: CommentVO, sonComment: any) => {
    console.log(fatherComment, sonComment);
    if (sonComment) {
        isReplying[sonComment?.id] = !isReplying[sonComment?.id];
        replyComment.value.replyId = sonComment?.id
        replyContent[sonComment?.id] = '@' + sonComment?.userName + ' '
    } else {
        isReplying[fatherComment.id as any] = !isReplying[fatherComment.id as any];
        replyComment.value.replyId = fatherComment.id as any
        replyContent[fatherComment.id as any] = '@' + fatherComment?.userName + ' '
    }
    replyComment.value.replyFatherId = fatherComment.id as any
}
const submitReply = async (fatherComment: CommentVO, sonComment: any) => {
    if (sonComment) {
        replyComment.value.content = replyContent[replyComment.value.replyId as any]
    } else {
        replyComment.value.content = replyContent[replyComment.value.replyFatherId as any]
    }
    const res = await CommentControllerService.addCommentUsingPost(replyComment.value)
    if (res.code === 0) {
        Message.success("回复成功")
        replyComment.value.content = ""
        replyContent[replyComment.value.replyFatherId as any] = ""
        if (!exitsComment.value[replyComment.value.replyFatherId as any]) {
            exitsComment.value[replyComment.value.replyFatherId as any] = true
        }
        getCommentByIdList(fatherComment, replyComment.value.replyFatherId)
    } else {
        Message.error("回复失败")
    }
}
const onLikeChange = async (comment: CommentVO, fatherComment: any) => {
    const currentTime = Date.now();
    if (lastThumbsUpTime.value[comment.id as any] && (currentTime - lastThumbsUpTime.value[comment.id as any]) < 3000) {
        Message.warning("操作频繁");
        return;
    }
    const res = await CommentThumbControllerService.doThumbUsingPost({ commentId: comment.id })
    if (res.code === 0) {
        Message.success("操作成功")
        lastThumbsUpTime.value[comment.id as any] = currentTime;
        if (comment.replyFatherId) {
            getCommentByIdList(fatherComment, comment.replyFatherId)
        } else {
            pageQuery()
        }
    } else {
        Message.error("操作失败")
    }
}
const sendComment = async () => {
    //TODO
    const res = await CommentControllerService.addCommentUsingPost(commentAddRequest.value);
    if (res.code === 0) {
        Message.success("评论成功")
        pageQuery()
        commentAddRequest.value.content = ""
    } else {
        Message.error("评论失败")
    }
}
const handleOk = () => {
    visible.value = false;
};
const handleCancel = () => {
    visible.value = false;
}
const handleSubmit = async () => {
    questionSubmitVo.value = {}
    visible.value = true;
    const res = await QuestionSubmitControllerService.doQuestionUsingPost({
        ...requestMessage.value,
        questionId: param.id as any
    })
    if (res.code === 0) {
        Message.success("提交成功")
        questionSubmitVo.value = res.data
        loading.value = true
    } else {
        Message.error("提交失败：" + res.message)
    }
};
const handleChange = (v: string) => {
    requestMessage.value.code = v
}
const questionGetById = async () => {
    const res = await QuestionControllerService.getQuestionVoByIdUsingGet(param.id as any)
    if (res.code === 0) {
        data.value = res.data
    } else {
        Message.error("获取失败：" + res.message)
    }
}
const pageQuery = async () => {
    const res = await CommentControllerService.listCommentVoByPageUsingPost(pagination.value as any);
    if (res.code === 0) {
        userComment.value = res.data.records
        total.value = res.data.total
    } else {
        Message.error("获取失败：" + res.message)
    }
}
const pageChange = async (page: number) => {
    pagination.value.current = page;
    await pageQuery();
    await loadParentCommentsWithReplies();
}
watch(activeKey, async (newVal) => {
    if (newVal === 'comment') {
        await pageQuery();
        await loadParentCommentsWithReplies();
    } else {
        return;
    }
});
watch(() => requestMessage.value.language, (newLanguage) => {
    if (newLanguage === 'java') {
        requestMessage.value.code = initCode.value.java || '';
    } else if (newLanguage === 'c') {
        requestMessage.value.code = initCode.value.c || '';
    } else if (newLanguage === 'python') {
        requestMessage.value.code = initCode.value.python || '';
    } else {
        requestMessage.value.code = '';
    }
    console.log("初始代码为" + requestMessage.value.code)
});
const loadParentCommentsWithReplies = async () => {
    // 遍历父评论并加载每个父评论的子评论
    for (const comment of userComment.value) {
        await getCommentByIdList(comment, undefined);
    }
};
onMounted(() => {
    questionGetById()
})
</script>

<style scoped>
#doQuestionView {
    max-width: 100%;
    margin: 0 auto;
}

#doQuestionView .wrapper {
    position: relative;

    ul {
        height: 400px;
        overflow-y: auto;

        li {
            line-height: 40px;
            margin-bottom: 20px;
            /* 增加每个评论的间距 */
        }
    }
}

.action {
    display: inline-block;
    padding: 0 4px;
    color: var(--color-text-1);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
}

.action:hover {
    background: var(--color-fill-3);
}
</style>