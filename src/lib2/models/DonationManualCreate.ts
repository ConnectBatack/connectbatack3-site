/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
export type DonationManualCreate = {
    project_slug?: (string | null);
    amount: (number | string);
    currency?: Currency;
    payment_method: DonationManualCreate.payment_method;
    donor_first_name?: string;
    donor_last_name: string;
    donor_email?: (string | null);
    donor_phone?: (string | null);
    tax_receipt_requested?: boolean;
    language?: DonationManualCreate.language;
    receipt_reference?: (string | null);
    account?: string;
    entry_date?: (string | null);
};
export namespace DonationManualCreate {
    export enum payment_method {
        MOBILE_MONEY = 'mobile_money',
        ESPECES = 'especes',
        VIREMENT = 'virement',
    }
    export enum language {
        FR = 'fr',
        EN = 'en',
        ES = 'es',
        NL = 'nl',
    }
}

