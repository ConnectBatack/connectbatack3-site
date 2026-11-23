/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegistrySummaryOut = {
    total_validated_in_eur: string;
    total_validated_out_eur: string;
    available_balance_eur: string;
    available_balance_fcfa: number;
    pending_countersign_count: number;
    validated_count: number;
    rejected_count: number;
    balances_by_account_eur: Record<string, string>;
    parity_fcfa_per_eur: string;
};

