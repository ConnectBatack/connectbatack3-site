/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DonationStatus } from './DonationStatus';
export type DonationReceiptSubmitResponse = {
    donation_id: string;
    status: DonationStatus;
    receipt_reference: string;
    receipt_media_id: string;
    amount_fcfa: number;
    amount_eur: string;
    message: string;
};

