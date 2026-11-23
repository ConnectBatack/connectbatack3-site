/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { DonationFrequency } from './DonationFrequency';
import type { DonationStatus } from './DonationStatus';
import type { PaymentMethod } from './PaymentMethod';
export type DonationOut = {
    id: string;
    project_id: (string | null);
    amount_eur: string;
    original_amount: string;
    currency: Currency;
    frequency: DonationFrequency;
    payment_method: PaymentMethod;
    status: DonationStatus;
    donor_first_name: string;
    donor_last_name: string;
    donor_email: (string | null);
    donor_phone: (string | null);
    donor_country: (string | null);
    tax_receipt_requested: boolean;
    language: string;
    receipt_reference: (string | null);
    receipt_media_id: (string | null);
    paid_at: (string | null);
    created_at: string;
};

