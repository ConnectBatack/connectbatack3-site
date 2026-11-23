/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransferCreate } from '../models/TransferCreate';
import type { TransferOut } from '../models/TransferOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransfertsEntreRubriquesService {
    /**
     * Lister les transferts internes
     * @returns TransferOut Successful Response
     * @throws ApiError
     */
    public static listTransfersApiV1TransfersGet(): CancelablePromise<Array<TransferOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/transfers',
        });
    }
    /**
     * Enregistrer un transfert entre comptes/rubriques
     * @param requestBody
     * @returns TransferOut Successful Response
     * @throws ApiError
     */
    public static createTransferApiV1TransfersPost(
        requestBody: TransferCreate,
    ): CancelablePromise<TransferOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/transfers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Marquer un transfert comme remboursé
     * @param transferId
     * @returns TransferOut Successful Response
     * @throws ApiError
     */
    public static markTransferRepaidApiV1TransfersTransferIdRepayPost(
        transferId: string,
    ): CancelablePromise<TransferOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/transfers/{transfer_id}/repay',
            path: {
                'transfer_id': transferId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
