/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AhpCalculateRequest } from '../models/AhpCalculateRequest';
import type { AhpCalculateResponse } from '../models/AhpCalculateResponse';
import type { AhpSessionOut } from '../models/AhpSessionOut';
import type { AhpSessionSaveRequest } from '../models/AhpSessionSaveRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MThodeAhpPoidsDesTChesService {
    /**
     * Calculer les poids et le ratio de cohérence AHP
     * @param requestBody
     * @returns AhpCalculateResponse Successful Response
     * @throws ApiError
     */
    public static calculateAhpEndpointApiV1AhpCalculatePost(
        requestBody: AhpCalculateRequest,
    ): CancelablePromise<AhpCalculateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ahp/calculate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les séances AHP enregistrées
     * @returns AhpSessionOut Successful Response
     * @throws ApiError
     */
    public static listAhpSessionsApiV1AhpSessionsGet(): CancelablePromise<Array<AhpSessionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ahp/sessions',
        });
    }
    /**
     * Enregistrer une séance AHP
     * @param requestBody
     * @returns AhpSessionOut Successful Response
     * @throws ApiError
     */
    public static saveAhpSessionApiV1AhpSessionsPost(
        requestBody: AhpSessionSaveRequest,
    ): CancelablePromise<AhpSessionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ahp/sessions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Appliquer les poids AHP d'une séance aux tâches
     * @param sessionId
     * @returns AhpSessionOut Successful Response
     * @throws ApiError
     */
    public static applyAhpSessionApiV1AhpSessionsSessionIdApplyPost(
        sessionId: string,
    ): CancelablePromise<AhpSessionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ahp/sessions/{session_id}/apply',
            path: {
                'session_id': sessionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
