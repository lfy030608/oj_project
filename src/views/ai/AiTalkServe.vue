<template>
    <div class="ai-talk-serve">
        <!-- 消息展示区域 -->
        <div class="message-container" ref="messageContainer">
            <div v-for="(message, index) in messages" :key="index" class="message-item"
                :class="{ 'user-message': message.role === AI_ROLE_ENUM.USER }">
                <!-- AI头像 -->
                <a-avatar v-if="message.role === AI_ROLE_ENUM.ASSISTANT" class="avatar">
                    <img src="@/assets/deepseek.jpg" />
                </a-avatar>
                <!-- 消息内容 -->
                <div class="message-content">
                    <div v-if="message.role === AI_ROLE_ENUM.ASSISTANT">
                        <ViewEditor :value="message.message" :editable="false"/>
                    </div>
                    <div v-else-if="message.role === AI_ROLE_ENUM.USER" class="message-bubble">{{ message.message }}
                    </div>
                </div>
                <!-- 用户头像 -->
                <a-avatar v-if="message.role === AI_ROLE_ENUM.USER" class="avatar">
                    <img :src="loginUser?.userAvatar || '@/assets/head.jpg'" />
                </a-avatar>
            </div>
        </div>
        <!-- 输入框区域 -->
        <div class="input-container">
            <a-textarea v-model="inputMessage" placeholder="请输入问题..." :auto-size="{ minRows: 2, maxRows: 4 }" />
            <!-- <a-button :loading="loading" type="primary" @click="sendMessage">{{ status }}</a-button> -->
            <a-button :loading="loading" type="primary" @click="streamGeneratorMessage">{{ status }}</a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import AI_ROLE_ENUM from '@/access/AiRoleEnum';
import {
    AiControllerService,
    type AiMessage
} from '../../../generated';
import store from '@/store';
import { defineProps } from 'vue';
import { Message } from '@arco-design/web-vue';
import ViewEditor from '@/components/ViewEditor.vue';
const props = defineProps<{
    questionId: string;
}>();

const loginUser = computed(() => store.state.user?.loginUser);
const messages = ref<AiMessage[]>([]);
const inputMessage = ref('');
const messageContainer = ref<HTMLElement>();
const loading = ref(false);
const status = ref('发送');
// 获取历史消息
const fetchMessages = async () => {
    const res = await AiControllerService.getAiMessageByQuestionIdUsingGet(
        props.questionId as any
    );
    if (res.code === 0 && res.data) {
        messages.value = res.data || [];
        scrollToBottom();
    }
};

// 发送消息
const sendMessage = async () => {
    if (!inputMessage.value.trim()) return;
    messages.value.push({
        message: inputMessage.value,
        role: AI_ROLE_ENUM.USER
    });
    loading.value = true;
    status.value = '回答中';
    try {
        // 发送消息
        const result = await AiControllerService.doChatUsingPost({
            questionId: props.questionId as any,
            message: inputMessage.value
        });
        if (result.code === 0 && result.data) {
            //填充对话信息
            messages.value.push({
                message: result.data,
                role: AI_ROLE_ENUM.ASSISTANT
            })
        } else {
            Message.error("AI回答异常：" + result.message);
        }
    } catch (error) {
        console.error('发送失败:', error);
    } finally {
        loading.value = false;
        status.value = '发送';
        inputMessage.value = '';
    }
};
const streamGeneratorMessage = async () => {
    if (!props.questionId || !inputMessage.value) return;

    // 添加用户消息
    messages.value.push({
        message: inputMessage.value,
        role: AI_ROLE_ENUM.USER
    });

    // 添加初始的AI消息（空内容）
    messages.value.push({
        message: '', // 初始为空内容
        role: AI_ROLE_ENUM.ASSISTANT
    });

    const currentMessageIndex = messages.value.length - 1; // 记录当前AI消息索引
    loading.value = true;
    status.value = '回答中';
    try {
        const eventSource = new EventSource(
            `http://localhost:8101/api/ai/sse/do_chat_stream/?questionId=${encodeURIComponent(props.questionId)}&message=${encodeURIComponent(inputMessage.value)}`,
            { withCredentials: true }
        );
        eventSource.onmessage =  (event) => {
            if (event.data === '[DONE]') {
                eventSource.close();
                return;
            }
            // 直接更新messages数组中对应的AI消息内容
            messages.value[currentMessageIndex].message += event.data;
            scrollToBottom(); // 每次更新后滚动
        };

        eventSource.onerror = async (event) => {
            if (event.eventPhase === EventSource.CLOSED) {
                eventSource.close();
                await fetchMessages();
                loading.value = false;
                status.value = '发送';
                inputMessage.value = '';
                scrollToBottom();
            }
        };
    } catch (error) {
        Message.error('连接异常: ' + error);
        loading.value = false;
        status.value = '发送';
    }
};
// 自动滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
    });
};

// 监听questionId变化
watch(() => props.questionId, fetchMessages);
onMounted(() => {
    fetchMessages();
});
</script>

<style scoped>
.ai-talk-serve {
    height: calc(100vh - 160px);
    /* 动态高度 */
    position: relative;
}

.message-container {
    height: calc(100% - 120px);
    overflow-y: auto;
    padding: 20px;
}

.message-item {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.user-message {
    flex-direction: row-reverse;
}

.avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
}

.message-content {
    max-width: 70%;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    background: #f0f0f0;
    word-break: break-word;
}

.user-message .message-bubble {
    background: #3498db;
    color: white;
}

.input-container {
    position: fixed;
    width: 38%;
    left: 20px;
    bottom: 60px;
    /* 根据footer高度调整 */
    display: flex;
    gap: 12px;
    background: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .input-container {
        width: 80%;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>