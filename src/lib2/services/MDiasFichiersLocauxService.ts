/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_media_api_v1_media_upload_post } from '../models/Body_upload_media_api_v1_media_upload_post';
import type { MediaAssetOut } from '../models/MediaAssetOut';
import type { MediaAssetUpdate } from '../models/MediaAssetUpdate';
import type { MediaCategory } from '../models/MediaCategory';
import type { MessageResponse } from '../models/MessageResponse';
import type { PaginatedResponse_MediaAssetOut_ } from '../models/PaginatedResponse_MediaAssetOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MDiasFichiersLocauxService {
    /**
     * Téléverser un média en local
     * @param formData
     * @returns MediaAssetOut Successful Response
     * @throws ApiError
     */
    public static uploadMediaApiV1MediaUploadPost(
        formData: Body_upload_media_api_v1_media_upload_post,
    ): CancelablePromise<MediaAssetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/media/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les médias
     * @param category
     * @param limit
     * @param offset
     * @returns PaginatedResponse_MediaAssetOut_ Successful Response
     * @throws ApiError
     */
    public static listMediaApiV1MediaGet(
        category?: (MediaCategory | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_MediaAssetOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media',
            query: {
                'category': category,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Métadonnées d'un média par slug
     * @param slug
     * @returns MediaAssetOut Successful Response
     * @throws ApiError
     */
    public static getMediaBySlugApiV1MediaBySlugSlugGet(
        slug: string,
    ): CancelablePromise<MediaAssetOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/by-slug/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Servir le fichier binaire depuis le dossier local
     * @param assetId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static serveMediaFileApiV1MediaFilesAssetIdGet(
        assetId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/files/{asset_id}',
            path: {
                'asset_id': assetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Servir le fichier binaire par slug
     * @param slug
     * @returns any Successful Response
     * @throws ApiError
     */
    public static serveMediaFileBySlugApiV1MediaFilesBySlugSlugGet(
        slug: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/media/files-by-slug/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mettre à jour les métadonnées d'un média
     * @param assetId
     * @param requestBody
     * @returns MediaAssetOut Successful Response
     * @throws ApiError
     */
    public static updateMediaMetadataApiV1MediaAssetIdPatch(
        assetId: string,
        requestBody: MediaAssetUpdate,
    ): CancelablePromise<MediaAssetOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/media/{asset_id}',
            path: {
                'asset_id': assetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer un média du stockage local
     * @param assetId
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static deleteMediaApiV1MediaAssetIdDelete(
        assetId: string,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/media/{asset_id}',
            path: {
                'asset_id': assetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
