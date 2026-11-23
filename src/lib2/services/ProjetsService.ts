/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';
import type { ProjectCreate } from '../models/ProjectCreate';
import type { ProjectOut } from '../models/ProjectOut';
import type { ProjectTranslateRequest } from '../models/ProjectTranslateRequest';
import type { ProjectTranslateResponse } from '../models/ProjectTranslateResponse';
import type { ProjectUpdate } from '../models/ProjectUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjetsService {
    /**
     * Traduire automatiquement un projet via Google Translate
     * @param requestBody
     * @returns ProjectTranslateResponse Successful Response
     * @throws ApiError
     */
    public static translateProjectApiV1ProjectsTranslatePost(
        requestBody: ProjectTranslateRequest,
    ): CancelablePromise<ProjectTranslateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/translate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les projets du village
     * @param includeArchived
     * @returns ProjectOut Successful Response
     * @throws ApiError
     */
    public static listProjectsApiV1ProjectsGet(
        includeArchived: boolean = false,
    ): CancelablePromise<Array<ProjectOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects',
            query: {
                'include_archived': includeArchived,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Créer un projet
     * @param requestBody
     * @returns ProjectOut Successful Response
     * @throws ApiError
     */
    public static createProjectApiV1ProjectsPost(
        requestBody: ProjectCreate,
    ): CancelablePromise<ProjectOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Détail d'un projet
     * @param slug
     * @returns ProjectOut Successful Response
     * @throws ApiError
     */
    public static getProjectApiV1ProjectsSlugGet(
        slug: string,
    ): CancelablePromise<ProjectOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mettre à jour un projet
     * @param slug
     * @param requestBody
     * @returns ProjectOut Successful Response
     * @throws ApiError
     */
    public static updateProjectApiV1ProjectsSlugPatch(
        slug: string,
        requestBody: ProjectUpdate,
    ): CancelablePromise<ProjectOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/projects/{slug}',
            path: {
                'slug': slug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer un projet (admin)
     * @param slug
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static deleteProjectApiV1ProjectsSlugDelete(
        slug: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
