/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';
import type { TaskCreate } from '../models/TaskCreate';
import type { TaskOut } from '../models/TaskOut';
import type { TaskUpdate } from '../models/TaskUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TChesCandidatesService {
    /**
     * Lister les tâches de planification
     * @returns TaskOut Successful Response
     * @throws ApiError
     */
    public static listTasksApiV1TasksGet(): CancelablePromise<Array<TaskOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks',
        });
    }
    /**
     * Créer une tâche
     * @param requestBody
     * @returns TaskOut Successful Response
     * @throws ApiError
     */
    public static createTaskApiV1TasksPost(
        requestBody: TaskCreate,
    ): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tasks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Modifier une tâche
     * @param taskId
     * @param requestBody
     * @returns TaskOut Successful Response
     * @throws ApiError
     */
    public static updateTaskApiV1TasksTaskIdPatch(
        taskId: string,
        requestBody: TaskUpdate,
    ): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/tasks/{task_id}',
            path: {
                'task_id': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer une tâche
     * @param taskId
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static deleteTaskApiV1TasksTaskIdDelete(
        taskId: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/tasks/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
