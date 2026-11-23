/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_submit_donation_receipt_api_v1_donations_submit_receipt_post = {
    montant_fcfa: number;
    moyen: Body_submit_donation_receipt_api_v1_donations_submit_receipt_post.moyen;
    receipt_reference: string;
    nom: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    pays?: Body_submit_donation_receipt_api_v1_donations_submit_receipt_post.pays;
    attestation?: boolean;
    conditions: boolean;
    langue?: string;
    projet?: string;
    receipt_file: string;
};
export namespace Body_submit_donation_receipt_api_v1_donations_submit_receipt_post {
    export enum moyen {
        VIREMENT = 'virement',
        MOBILE_MONEY = 'mobile_money',
        DEPOT_BANCAIRE = 'depot_bancaire',
    }
    export enum pays {
        BE = 'BE',
        AUTRE = 'autre',
    }
}

