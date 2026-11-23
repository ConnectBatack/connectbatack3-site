/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicLedgerItemOut } from './PublicLedgerItemOut';
export type TransparencyOut = {
    total_collected_eur: string;
    total_spent_eur: string;
    available_balance_eur: string;
    donors_count: number;
    projects_count: number;
    parity_fcfa_per_eur: string;
    recent_entries: Array<PublicLedgerItemOut>;
};

