/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';
import type { SiteContentOut } from '../models/SiteContentOut';
import type { SiteContentUpsert } from '../models/SiteContentUpsert';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContenusDitoriauxCmsService {
    /**
     * Lister les blocs de contenu
     * @param section
     * @returns SiteContentOut Successful Response
     * @throws ApiError
     */
    public static listContentsApiV1ContentsGet(
        section?: (string | null),
    ): CancelablePromise<Array<SiteContentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contents',
            query: {
                'section': section,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Récupérer un bloc de contenu par clé
     * @param key
     * @returns SiteContentOut Successful Response
     * @throws ApiError
     */
    public static getContentApiV1ContentsKeyGet(
        key: string,
    ): CancelablePromise<SiteContentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contents/{key}',
            path: {
                'key': key,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Créer ou modifier un bloc de contenu
     * @param key
     * @param requestBody
     * @returns SiteContentOut Successful Response
     * @throws ApiError
     */
    public static upsertContentApiV1ContentsKeyPut(
        key: string,
        requestBody: SiteContentUpsert,
    ): CancelablePromise<SiteContentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/contents/{key}',
            path: {
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer un bloc de contenu (admin)
     * @param key
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static deleteContentApiV1ContentsKeyDelete(
        key: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/contents/{key}',
            path: {
                'key': key,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
