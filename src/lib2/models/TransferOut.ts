/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
export type TransferOut = {
    id: string;
    source_project_id: (string | null);
    destination_project_id: (string | null);
    source_account: string;
    destination_account: string;
    amount: string;
    currency: Currency;
    reason: string;
    is_repaid: boolean;
    repaid_at: (string | null);
    transfer_date: string;
    created_by_id: (string | null);
    created_at: string;
};

