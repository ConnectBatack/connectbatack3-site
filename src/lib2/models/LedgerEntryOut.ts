/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { LedgerDirection } from './LedgerDirection';
import type { LedgerEntryType } from './LedgerEntryType';
import type { LedgerStatus } from './LedgerStatus';
export type LedgerEntryOut = {
    id: string;
    entry_number: number;
    entry_type: LedgerEntryType;
    entry_date: string;
    label: string;
    account: string;
    direction: LedgerDirection;
    amount: string;
    currency: Currency;
    amount_eur_equiv: string;
    amount_fcfa_equiv: number;
    status: LedgerStatus;
    project_id: (string | null);
    donation_id: (string | null);
    transfer_id: (string | null);
    justificatif_media_id: (string | null);
    receipt_number: (string | null);
    corrects_entry_id: (string | null);
    target_entry_id: (string | null);
    created_by_id: (string | null);
    validated_by_id: (string | null);
    validated_at: (string | null);
    rejection_reason: (string | null);
    previous_hash: string;
    entry_hash: string;
    created_at: string;
};

