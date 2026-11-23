/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_SubscriptionOut_ } from '../models/PaginatedResponse_SubscriptionOut_';
import type { SubscriptionActionResponse } from '../models/SubscriptionActionResponse';
import type { SubscriptionCreate } from '../models/SubscriptionCreate';
import type { SubscriptionStatus } from '../models/SubscriptionStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SuiviDesProjetsRgpdService {
    /**
     * S'inscrire au suivi d'un projet (double opt-in par e-mail)
     * @param requestBody
     * @returns SubscriptionActionResponse Successful Response
     * @throws ApiError
     */
    public static followProjectApiV1SubscriptionsFollowPost(
        requestBody: SubscriptionCreate,
    ): CancelablePromise<SubscriptionActionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/subscriptions/follow',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmer l'inscription (double opt-in)
     * @param token
     * @returns SubscriptionActionResponse Successful Response
     * @throws ApiError
     */
    public static confirmSubscriptionApiV1SubscriptionsConfirmGet(
        token: string,
    ): CancelablePromise<SubscriptionActionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/subscriptions/confirm',
            query: {
                'token': token,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Se désinscrire d'un projet
     * @param token
     * @returns SubscriptionActionResponse Successful Response
     * @throws ApiError
     */
    public static unsubscribeProjectApiV1SubscriptionsUnsubscribeGet(
        token: string,
    ): CancelablePromise<SubscriptionActionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/subscriptions/unsubscribe',
            query: {
                'token': token,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les abonnés (espace gestion)
     * @param projectId
     * @param status
     * @param limit
     * @param offset
     * @returns PaginatedResponse_SubscriptionOut_ Successful Response
     * @throws ApiError
     */
    public static listSubscriptionsApiV1SubscriptionsGet(
        projectId?: (string | null),
        status?: (SubscriptionStatus | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_SubscriptionOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/subscriptions',
            query: {
                'project_id': projectId,
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
