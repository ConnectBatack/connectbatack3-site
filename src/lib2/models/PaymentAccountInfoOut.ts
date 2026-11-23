/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Coordonnées du COVIDEBA et numéros de compte pour effectuer un don direct.
 */
export type PaymentAccountInfoOut = {
    covideba_email: string;
    covideba_phone: string;
    bank_holder: string;
    bank_name: string;
    bank_account: string;
    mobile_money_mtn: string;
    mobile_money_orange: string;
    postal_address?: (string | null);
    other_info?: (string | null);
    parity_fcfa_per_eur: string;
};

