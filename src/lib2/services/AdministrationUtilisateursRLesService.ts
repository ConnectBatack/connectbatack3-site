/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminResetPasswordRequest } from '../models/AdminResetPasswordRequest';
import type { MessageResponse } from '../models/MessageResponse';
import type { PaginatedResponse_UserOut_ } from '../models/PaginatedResponse_UserOut_';
import type { UserCreate } from '../models/UserCreate';
import type { UserOut } from '../models/UserOut';
import type { UserRole } from '../models/UserRole';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministrationUtilisateursRLesService {
    /**
     * Lister les comptes (admin)
     * @param role
     * @param isActive
     * @param limit
     * @param offset
     * @returns PaginatedResponse_UserOut_ Successful Response
     * @throws ApiError
     */
    public static listUsersApiV1UsersGet(
        role?: (UserRole | null),
        isActive?: (boolean | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_UserOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'role': role,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Créer un compte (admin)
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static createUserApiV1UsersPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Détail d'un utilisateur (admin)
     * @param userId
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static getUserApiV1UsersUserIdGet(
        userId: string,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Modifier rôle ou statut (admin)
     * @param userId
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static updateUserApiV1UsersUserIdPatch(
        userId: string,
        requestBody: UserUpdate,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Réinitialiser un mot de passe (admin)
     * @param userId
     * @param requestBody
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static adminResetPasswordApiV1UsersUserIdResetPasswordPost(
        userId: string,
        requestBody: AdminResetPasswordRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/{user_id}/reset-password',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Déverrouiller un compte (admin)
     * @param userId
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static unlockUserApiV1UsersUserIdUnlockPost(
        userId: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/{user_id}/unlock',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
