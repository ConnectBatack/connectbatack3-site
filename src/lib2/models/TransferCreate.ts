/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
export type TransferCreate = {
    source_project_id?: (string | null);
    destination_project_id?: (string | null);
    source_account: string;
    destination_account: string;
    amount: (number | string);
    currency?: Currency;
    reason: string;
    transfer_date: string;
};

