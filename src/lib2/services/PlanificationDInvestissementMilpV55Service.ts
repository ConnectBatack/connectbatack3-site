/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanInstanceIn } from '../models/PlanInstanceIn';
import type { PlanOut } from '../models/PlanOut';
import type { PlanSaveRequest } from '../models/PlanSaveRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlanificationDInvestissementMilpV55Service {
    /**
     * Résoudre une instance d'investissement avec HiGHS
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static solvePlanApiV1PlansSolvePost(
        requestBody: PlanInstanceIn,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plans/solve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les plans enregistrés
     * @returns PlanOut Successful Response
     * @throws ApiError
     */
    public static listPlansApiV1PlansGet(): CancelablePromise<Array<PlanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plans',
        });
    }
    /**
     * Enregistrer un plan vérifié
     * @param requestBody
     * @returns PlanOut Successful Response
     * @throws ApiError
     */
    public static savePlanApiV1PlansPost(
        requestBody: PlanSaveRequest,
    ): CancelablePromise<PlanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plans',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Valider officiellement un plan d'investissement
     * @param planId
     * @returns PlanOut Successful Response
     * @throws ApiError
     */
    public static validatePlanApiV1PlansPlanIdValidatePost(
        planId: string,
    ): CancelablePromise<PlanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plans/{plan_id}/validate',
            path: {
                'plan_id': planId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archiver un plan
     * @param planId
     * @returns PlanOut Successful Response
     * @throws ApiError
     */
    public static archivePlanApiV1PlansPlanIdArchivePost(
        planId: string,
    ): CancelablePromise<PlanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plans/{plan_id}/archive',
            path: {
                'plan_id': planId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
