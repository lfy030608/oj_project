/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiRequest } from '../models/AiRequest';
import type { BaseResponse_List_AiMessage_ } from '../models/BaseResponse_List_AiMessage_';
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { SseEmitter } from '../models/SseEmitter';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiControllerService {
    /**
     * doChat
     * @param aiRequest aiRequest
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doChatUsingPost(
        aiRequest: AiRequest,
    ): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/do_chat',
            body: aiRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getAiMessageByQuestionId
     * @param questionId questionId
     * @returns BaseResponse_List_AiMessage_ OK
     * @throws ApiError
     */
    public static getAiMessageByQuestionIdUsingGet(
        questionId: number,
    ): CancelablePromise<BaseResponse_List_AiMessage_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai/get/by/question_id',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * doChatStream
     * @param message
     * @param questionId
     * @returns SseEmitter OK
     * @throws ApiError
     */
    public static doChatStreamUsingGet(
        message?: string,
        questionId?: number,
    ): CancelablePromise<SseEmitter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai/sse/do_chat_stream',
            query: {
                'message': message,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
