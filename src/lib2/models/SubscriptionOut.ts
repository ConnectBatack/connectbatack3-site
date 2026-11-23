/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionStatus } from './SubscriptionStatus';
export type SubscriptionOut = {
    id: string;
    email: string;
    project_id: string;
    language: string;
    consent_given: boolean;
    consent_date: string;
    status: SubscriptionStatus;
    confirmed_at: (string | null);
    unsubscribed_at: (string | null);
    created_at: string;
};

