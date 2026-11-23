/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationSettingsOut } from '../models/OrganizationSettingsOut';
import type { OrganizationSettingsUpdate } from '../models/OrganizationSettingsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministrationParamTresDuSiteComptesService {
    /**
     * Consulter les coordonnées et numéros de compte du COVIDEBA
     * @returns OrganizationSettingsOut Successful Response
     * @throws ApiError
     */
    public static readOrganizationSettingsApiV1SettingsOrganizationGet(): CancelablePromise<OrganizationSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/organization',
        });
    }
    /**
     * Modifier les coordonnées et numéros de compte du COVIDEBA (admin)
     * @param requestBody
     * @returns OrganizationSettingsOut Successful Response
     * @throws ApiError
     */
    public static writeOrganizationSettingsApiV1SettingsOrganizationPut(
        requestBody: OrganizationSettingsUpdate,
    ): CancelablePromise<OrganizationSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/settings/organization',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
