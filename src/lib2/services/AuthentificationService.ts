/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { MessageResponse } from '../models/MessageResponse';
import type { MeUpdateRequest } from '../models/MeUpdateRequest';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { TotpDisableRequest } from '../models/TotpDisableRequest';
import type { TotpSetupRequest } from '../models/TotpSetupRequest';
import type { TotpSetupResponse } from '../models/TotpSetupResponse';
import type { TotpVerifyRequest } from '../models/TotpVerifyRequest';
import type { UserOut } from '../models/UserOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthentificationService {
    /**
     * Connexion espace COVIDEBA
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public static loginApiV1AuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Rafraîchir le jeton d'accès
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public static refreshTokensApiV1AuthRefreshPost(
        requestBody: RefreshRequest,
    ): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Déconnexion
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static logoutApiV1AuthLogoutPost(): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
        });
    }
    /**
     * Profil de l'utilisateur connecté
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static getMeApiV1AuthMeGet(): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me',
        });
    }
    /**
     * Modifier ses informations personnelles
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static updateMeApiV1AuthMePatch(
        requestBody: MeUpdateRequest,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/auth/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Changer son mot de passe
     * @param requestBody
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static changePasswordApiV1AuthChangePasswordPost(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Initialiser la double authentification TOTP
     * @param requestBody
     * @returns TotpSetupResponse Successful Response
     * @throws ApiError
     */
    public static setupTotpApiV1Auth2FaSetupPost(
        requestBody: TotpSetupRequest,
    ): CancelablePromise<TotpSetupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/2fa/setup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activer la double authentification TOTP
     * @param requestBody
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static enableTotpApiV1Auth2FaEnablePost(
        requestBody: TotpVerifyRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/2fa/enable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Désactiver la double authentification TOTP
     * @param requestBody
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static disableTotpApiV1Auth2FaDisablePost(
        requestBody: TotpDisableRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/2fa/disable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
