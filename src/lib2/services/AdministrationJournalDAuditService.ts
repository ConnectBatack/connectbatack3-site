/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_AuditLogOut_ } from '../models/PaginatedResponse_AuditLogOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministrationJournalDAuditService {
    /**
     * Consulter le journal d'audit
     * @param action
     * @param resourceType
     * @param limit
     * @param offset
     * @returns PaginatedResponse_AuditLogOut_ Successful Response
     * @throws ApiError
     */
    public static listAuditLogsApiV1AuditLogsGet(
        action?: (string | null),
        resourceType?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_AuditLogOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit-logs',
            query: {
                'action': action,
                'resource_type': resourceType,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
