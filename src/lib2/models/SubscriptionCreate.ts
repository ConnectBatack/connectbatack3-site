/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscriptionCreate = {
    email: string;
    projet: string;
    langue?: SubscriptionCreate.langue;
    consentement: boolean;
};
export namespace SubscriptionCreate {
    export enum langue {
        FR = 'fr',
        EN = 'en',
        ES = 'es',
        NL = 'nl',
    }
}

