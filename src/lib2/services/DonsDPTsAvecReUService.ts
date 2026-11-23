/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_submit_donation_receipt_api_v1_donations_submit_receipt_post } from '../models/Body_submit_donation_receipt_api_v1_donations_submit_receipt_post';
import type { DonationManualCreate } from '../models/DonationManualCreate';
import type { DonationOut } from '../models/DonationOut';
import type { DonationReceiptSubmitResponse } from '../models/DonationReceiptSubmitResponse';
import type { DonationStatus } from '../models/DonationStatus';
import type { PaginatedResponse_DonationOut_ } from '../models/PaginatedResponse_DonationOut_';
import type { PaymentAccountInfoOut } from '../models/PaymentAccountInfoOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DonsDPTsAvecReUService {
    /**
     * Coordonnées et comptes de dépôt du COVIDEBA
     * @returns PaymentAccountInfoOut Successful Response
     * @throws ApiError
     */
    public static getPaymentAccountsApiV1DonationsAccountsGet(): CancelablePromise<PaymentAccountInfoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/donations/accounts',
        });
    }
    /**
     * Soumettre un reçu de dépôt/virement pour confirmer un don
     * Reçoit la confirmation d'un don effectué directement sur le compte bancaire
     * ou Mobile Money du COVIDEBA : enregistre le reçu dans storage/justificatifs/
     * (privé) et crée une écriture `a_contresigner` en attente de vérification par le trésorier.
     * @param formData
     * @returns DonationReceiptSubmitResponse Successful Response
     * @throws ApiError
     */
    public static submitDonationReceiptApiV1DonationsSubmitReceiptPost(
        formData: Body_submit_donation_receipt_api_v1_donations_submit_receipt_post,
    ): CancelablePromise<DonationReceiptSubmitResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/donations/submit-receipt',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Enregistrer un don manuel (espèces, Mobile Money, virement — e-mail facultatif)
     * @param requestBody
     * @returns DonationOut Successful Response
     * @throws ApiError
     */
    public static recordManualDonationApiV1DonationsManualPost(
        requestBody: DonationManualCreate,
    ): CancelablePromise<DonationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/donations/manual',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les dons (espace gestion)
     * @param status
     * @param projectId
     * @param limit
     * @param offset
     * @returns PaginatedResponse_DonationOut_ Successful Response
     * @throws ApiError
     */
    public static listDonationsApiV1DonationsGet(
        status?: (DonationStatus | null),
        projectId?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<PaginatedResponse_DonationOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/donations',
            query: {
                'status': status,
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
     * Détail d'un don
     * @param donationId
     * @returns DonationOut Successful Response
     * @throws ApiError
     */
    public static getDonationApiV1DonationsDonationIdGet(
        donationId: string,
    ): CancelablePromise<DonationOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/donations/{donation_id}',
            path: {
                'donation_id': donationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
