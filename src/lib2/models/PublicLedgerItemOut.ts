/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LedgerDirection } from './LedgerDirection';
export type PublicLedgerItemOut = {
    entry_number: number;
    entry_date: string;
    label: string;
    account: string;
    direction: LedgerDirection;
    amount_eur_equiv: string;
    entry_hash: string;
    justificatif_url?: (string | null);
};

