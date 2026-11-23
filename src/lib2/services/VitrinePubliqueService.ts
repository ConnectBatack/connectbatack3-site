/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransparencyOut } from '../models/TransparencyOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VitrinePubliqueService {
    /**
     * Données complètes de la page d'accueil
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPublicHomeApiV1PublicHomeGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/home',
        });
    }
    /**
     * Données publiques de transparence financière
     * @returns TransparencyOut Successful Response
     * @throws ApiError
     */
    public static getPublicTransparencyApiV1PublicTransparenceGet(): CancelablePromise<TransparencyOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/transparence',
        });
    }
}
