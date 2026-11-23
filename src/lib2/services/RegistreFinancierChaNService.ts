/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntegrityCheckOut } from '../models/IntegrityCheckOut';
import type { LedgerDirection } from '../models/LedgerDirection';
import type { LedgerEntryCreate } from '../models/LedgerEntryCreate';
import type { LedgerEntryOut } from '../models/LedgerEntryOut';
import type { LedgerEntryRejectRequest } from '../models/LedgerEntryRejectRequest';
import type { LedgerStatus } from '../models/LedgerStatus';
import type { PaginatedResponse_LedgerEntryOut_ } from '../models/PaginatedResponse_LedgerEntryOut_';
import type { RegistrySummaryOut } from '../models/RegistrySummaryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RegistreFinancierChaNService {
    /**
     * Lister les écritures du registre
     * @param status
     * @param direction
     * @param account
     * @param projectId
     * @param limit
     * @param offset
     * @returns PaginatedResponse_LedgerEntryOut_ Successful Response
     * @throws ApiError
     */
    public static listEntriesApiV1RegistryEntriesGet(
        status?: (LedgerStatus | null),
        direction?: (LedgerDirection | null),
        account?: (string | null),
        projectId?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_LedgerEntryOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/registry/entries',
            query: {
                'status': status,
                'direction': direction,
                'account': account,
                'project_id': projectId,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Créer une écriture immuable
     * @param requestBody
     * @returns LedgerEntryOut Successful Response
     * @throws ApiError
     */
    public static createEntryApiV1RegistryEntriesPost(
        requestBody: LedgerEntryCreate,
    ): CancelablePromise<LedgerEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/registry/entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Soldes et indicateurs du registre
     * @returns RegistrySummaryOut Successful Response
     * @throws ApiError
     */
    public static getSummaryApiV1RegistrySummaryGet(): CancelablePromise<RegistrySummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/registry/summary',
        });
    }
    /**
     * Contresigner / valider une écriture
     * @param entryId
     * @returns LedgerEntryOut Successful Response
     * @throws ApiError
     */
    public static validateEntryEndpointApiV1RegistryEntriesEntryIdValidatePost(
        entryId: string,
    ): CancelablePromise<LedgerEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/registry/entries/{entry_id}/validate',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Rejeter une écriture avec motif
     * @param entryId
     * @param requestBody
     * @returns LedgerEntryOut Successful Response
     * @throws ApiError
     */
    public static rejectEntryEndpointApiV1RegistryEntriesEntryIdRejectPost(
        entryId: string,
        requestBody: LedgerEntryRejectRequest,
    ): CancelablePromise<LedgerEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/registry/entries/{entry_id}/reject',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vérifier l'intégrité de la chaîne SHA-256
     * @returns IntegrityCheckOut Successful Response
     * @throws ApiError
     */
    public static verifyIntegrityEndpointApiV1RegistryVerifyIntegrityGet(): CancelablePromise<IntegrityCheckOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/registry/verify-integrity',
        });
    }
    /**
     * Exporter le registre (CSV ou JSON)
     * @param fmt
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportRegistryApiV1RegistryExportGet(
        fmt: 'csv' | 'json' = 'csv',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/registry/export',
            query: {
                'fmt': fmt,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
