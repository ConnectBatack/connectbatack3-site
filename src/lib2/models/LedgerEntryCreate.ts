/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { LedgerDirection } from './LedgerDirection';
export type LedgerEntryCreate = {
    entry_date: string;
    label: string;
    account: string;
    direction: LedgerDirection;
    amount: (number | string);
    currency?: Currency;
    project_id?: (string | null);
    justificatif_media_id?: (string | null);
    receipt_number?: (string | null);
    corrects_entry_id?: (string | null);
};

